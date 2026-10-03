# Contributing to PhishGuard AI

Thank you for your interest in contributing to **PhishGuard AI**! This project is maintained under high-grade software engineering and machine learning principles.

## Monorepo Architecture

- `apps/web`: Next.js 14+ / React frontend with TypeScript, Tailwind CSS, and Framer Motion.
- `apps/api`: Python FastAPI backend with Pydantic v2, SQLAlchemy async, and JWT auth.
- `ml/`: Model training scripts, feature extractors, dataset pipelines, and evaluation metrics.
- `docs/`: Comprehensive architecture, API schemas, security models, and academic papers.

## Development Workflow

1. **Fork and Clone** the repository.
2. **Setup Environment**:
   - Copy `.env.example` to `.env` in both root and relevant sub-apps.
   - Install backend dependencies: `pip install -r apps/api/requirements.txt`
   - Install frontend dependencies: `cd apps/web && npm install`
3. **Train / Validate ML Models**:
   - Run `python ml/training/train_all.py` to generate verified serialized artifacts into `ml/artifacts/`.
4. **Run Unit & Integration Tests**:
   - Backend: `pytest apps/api/tests/`
   - Frontend: `npm test` inside `apps/web`
5. **Code Style & Quality**:
   - Python: Black / Ruff / Flake8 standards with type annotations.
   - TypeScript: Strict typing with ESLint and Prettier.

## Commit Guidelines

Follow Conventional Commits:
- `feat:` New feature or detector capability
- `fix:` Bug fix or security patch
- `ml:` Model training, tuning, or feature extraction update
- `docs:` Documentation or academic paper updates
- `test:` Adding or updating test suites
- `refactor:` Code restructuring without behavior changes
