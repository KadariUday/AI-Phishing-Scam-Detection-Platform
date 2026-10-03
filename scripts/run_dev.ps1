# PhishGuard AI - Launch Development Environment
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting PhishGuard AI FullStack Servers" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Start Backend in new PowerShell window or background job
Write-Host "Starting FastAPI Backend on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/api; uvicorn app.main:app --reload --port 8000"

# Start Frontend
Write-Host "Starting Next.js Frontend on port 3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web; npm run dev"

Write-Host "==========================================" -ForegroundColor Yellow
Write-Host " Application Dashboard: http://localhost:3000" -ForegroundColor Cyan
Write-Host " FastAPI Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Yellow
