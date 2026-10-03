import {
  ScanResultData,
  ScanListItem,
  DashboardStats,
  AnalyticsData,
  AuthResponse,
  User,
  MongoActivityRecord,
  MongoStats,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("phishguard_token");
  }

  public setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("phishguard_token", token);
    }
  }

  public clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("phishguard_token");
      localStorage.removeItem("phishguard_user");
    }
  }

  public getSavedUser(): User | null {
    if (typeof window === "undefined") return null;
    const str = localStorage.getItem("phishguard_user");
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  public saveUser(user: User) {
    if (typeof window !== "undefined") {
      localStorage.setItem("phishguard_user", JSON.stringify(user));
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  // 1. Auth APIs
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Incorrect email or password. Only signed-up users can log in.");
    }

    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    this.saveUser(data.user);
    return data;
  }

  async register(email: string, password: string, full_name?: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        full_name: full_name?.trim() || undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(err.detail || "Unable to complete registration. Please check your details.");
    }

    return await res.json();
  }

  // 2. Scan APIs
  async scanUrl(url: string): Promise<ScanResultData> {
    const res = await fetch(`${API_BASE}/scans/url`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "URL Scan failed" }));
      throw new Error(err.detail || "Unable to scan URL");
    }
    return await res.json();
  }

  async scanMessage(text: string): Promise<ScanResultData> {
    const res = await fetch(`${API_BASE}/scans/message`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Message Scan failed" }));
      throw new Error(err.detail || "Unable to scan message");
    }
    return await res.json();
  }

  async scanEmail(sender: string, subject: string, body: string): Promise<ScanResultData> {
    const res = await fetch(`${API_BASE}/scans/email`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ sender, subject, body }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Email Scan failed" }));
      throw new Error(err.detail || "Unable to scan email");
    }
    return await res.json();
  }

  // 3. History & Scans
  async getScans(params?: {
    skip?: number;
    limit?: number;
    scan_type?: string;
    risk_level?: string;
    search?: string;
  }): Promise<ScanListItem[]> {
    const query = new URLSearchParams();
    if (params?.skip) query.set("skip", String(params.skip));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.scan_type && params.scan_type !== "ALL") query.set("scan_type", params.scan_type);
    if (params?.risk_level && params.risk_level !== "ALL") query.set("risk_level", params.risk_level);
    if (params?.search) query.set("search", params.search);

    try {
      const res = await fetch(`${API_BASE}/scans?${query.toString()}`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async getScanById(id: string): Promise<ScanResultData> {
    const res = await fetch(`${API_BASE}/scans/${id}`, {
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error("Scan record not found");
    return await res.json();
  }

  async deleteScan(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/scans/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error("Failed to delete scan");
  }

  // 4. Dashboard & Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
    return await res.json();
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`, {
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return await res.json();
  }

  // 5. Reports
  async createReportEntry(scanId: string): Promise<{ id: string; download_url: string }> {
    const res = await fetch(`${API_BASE}/reports/${scanId}`, {
      method: "POST",
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("Failed to create report entry");
    return await res.json();
  }

  getReportDownloadUrl(scanId: string): string {
    return `${API_BASE}/reports/${scanId}/download`;
  }

  // 6. MongoDB Persistence & History Tracking
  async getMongoActivityHistory(params?: { limit?: number; action?: string }): Promise<MongoActivityRecord[]> {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.action && params.action !== "ALL") query.set("action", params.action);

    try {
      const res = await fetch(`${API_BASE}/scans/mongodb/history?${query.toString()}`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  async getMongoStats(): Promise<MongoStats> {
    try {
      const res = await fetch(`${API_BASE}/scans/mongodb/stats`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) {
        return {
          connected: false,
          database: "phishguard_db",
          users_count: 0,
          history_events_count: 0,
          status: "offline",
        };
      }
      return await res.json();
    } catch {
      return {
        connected: false,
        database: "phishguard_db",
        users_count: 0,
        history_events_count: 0,
        status: "offline",
      };
    }
  }
}

export const api = new ApiClient();
