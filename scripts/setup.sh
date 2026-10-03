#!/usr/bin/env bash
set -e

echo "========================================="
echo " PhishGuard AI: Linux/macOS Setup Engine"
echo "========================================="

echo "[1/4] Checking Python..."
python3 --version

echo "[2/4] Installing Python Backend dependencies..."
pip install -r apps/api/requirements.txt

echo "[3/4] Training & Serializing ML Models..."
python3 ml/training/train_all.py

echo "[4/4] Installing Frontend dependencies..."
cd apps/web
npm install
cd ../..

echo "========================================="
echo " Setup Completed Successfully!"
echo "========================================="
