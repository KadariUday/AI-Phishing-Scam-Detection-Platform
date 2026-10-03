# PhishGuard AI - Unified Setup Script (PowerShell)
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " PhishGuard AI: Environment Setup Engine" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check Python
Write-Host "[1/4] Checking Python environment..." -ForegroundColor Yellow
python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 2. Install backend dependencies
Write-Host "[2/4] Installing Python Backend dependencies..." -ForegroundColor Yellow
python -m pip install --upgrade pip
pip install -r apps/api/requirements.txt

# 3. Train & Verify ML Models
Write-Host "[3/4] Training and serializing ML Classifiers & Artifacts..." -ForegroundColor Yellow
python ml/training/train_all.py

# 4. Frontend dependencies
Write-Host "[4/4] Installing Next.js Frontend dependencies..." -ForegroundColor Yellow
Set-Location apps/web
npm install
Set-Location ../..

Write-Host "=========================================" -ForegroundColor Green
Write-Host " Setup Completed Successfully! " -ForegroundColor Green
Write-Host " Start backend: cd apps/api && uvicorn app.main:app --reload" -ForegroundColor Green
Write-Host " Start frontend: cd apps/web && npm run dev" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
