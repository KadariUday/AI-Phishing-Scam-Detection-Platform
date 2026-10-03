export type RiskLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ScanType = "URL" | "MESSAGE" | "EMAIL";
export type ClassificationType = "BENIGN" | "SUSPICIOUS" | "PHISHING" | "SCAM";

export interface ThreatIndicator {
  code: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
}

export interface ScanResultData {
  id: string;
  scan_type: ScanType;
  target_text: string;
  target_domain?: string | null;
  risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  classification: ClassificationType;
  confidence: number; // 0.0 - 1.0
  ml_score?: number | null;
  intent_score?: number | null;
  heuristic_score?: number | null;
  features?: Record<string, any> | null;
  threat_indicators: ThreatIndicator[];
  explanations: string[];
  recommendations: string[];
  created_at: string;
}

export interface ScanListItem {
  id: string;
  scan_type: ScanType;
  target_text: string;
  target_domain?: string | null;
  risk_score: number;
  risk_level: RiskLevel;
  classification: ClassificationType;
  confidence: number;
  created_at: string;
}

export interface DashboardStats {
  total_scans: number;
  safe_scans: number;
  low_risk_scans: number;
  medium_risk_scans: number;
  high_risk_scans: number;
  critical_scans: number;
  average_risk_score: number;
  recent_scans: ScanListItem[];
  threat_breakdown: Record<RiskLevel, number>;
}

export interface AnalyticsData {
  total_scans: number;
  scan_type_distribution: Record<ScanType, number>;
  risk_level_distribution: Record<RiskLevel, number>;
  daily_volume: Array<{ date: string; scans: number; threats: number }>;
  top_threat_indicators: Array<{ code: string; name: string; count: number }>;
  model_performance: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface MongoActivityRecord {
  _id: string;
  user_id?: string | null;
  username: string;
  email: string;
  action: string;
  description: string;
  target_payload?: string | null;
  risk_level: RiskLevel | "N/A";
  risk_score: number;
  timestamp: string;
  readable_time: string;
  metadata?: Record<string, any>;
}

export interface MongoStats {
  connected: boolean;
  database: string;
  users_count: number;
  history_events_count: number;
  status: string;
}

