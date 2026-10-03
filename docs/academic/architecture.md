# Academic Documentation: Architecture

## 1. Monolithic Modular Architecture

PhishGuard AI employs a clean, modular tiered architecture designed for enterprise scalability, ease of maintenance, and continuous integration:

```
+-------------------------------------------------------------------------+
|                          Frontend Layer (Next.js)                       |
|   App Router / TypeScript / Tailwind CSS / Lucide / Recharts            |
|   - Component Architecture: Reusable Design System Tokens                |
|   - State Management: TanStack React Query + Custom Hooks               |
|   - Visualizations: Risk Gauges, Threat Indicator Badges, Histograms    |
+-------------------------------------------------------------------------+
                                    |
                           HTTP / JSON REST API
                                    v
+-------------------------------------------------------------------------+
|                          Backend Layer (FastAPI)                        |
|   Python 3.11+ / Asynchronous Endpoints / Pydantic v2                   |
|   - Authentication Middleware: JWT Bearer Tokens + Role RBAC            |
|   - Rate Limiting Middleware: In-Memory Token Bucket                    |
|   - Request Sanitization & Safe Parsers                                 |
+-------------------------------------------------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+-----------------------+                       +-----------------------+
|   Database Layer      |                       |    Analytics Engine   |
|   SQLAlchemy 2.0      |                       | - Feature Extraction  |
|   PostgreSQL / SQLite |                       | - Model Predictors    |
|   Alembic Migrations  |                       | - Rule Engine & XAI   |
+-----------------------+                       +-----------------------+
```

## 2. Component Decoupling & Interfaces

- **Detector Interface**: Polymorphic abstract base class `DetectorInterface` allowing plug-and-play extension for URL, Text, Email, and future OCR/Attachment analyzers.
- **Explainability Engine**: Translates high-dimensional statistical model coefficients into human-understandable security insights.
- **Reporting Subsystem**: Forensic PDF generator compiling threat indicators, technical headers, and recommended countermeasures into formal audit documentation.
