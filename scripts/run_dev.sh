#!/usr/bin/env bash
set -e

echo "=========================================="
echo " Starting PhishGuard AI FullStack Servers"
echo "=========================================="

echo "Starting FastAPI Backend on port 8000..."
(cd apps/api && uvicorn app.main:app --reload --port 8000) &

echo "Starting Next.js Frontend on port 3000..."
(cd apps/web && npm run dev) &

wait
