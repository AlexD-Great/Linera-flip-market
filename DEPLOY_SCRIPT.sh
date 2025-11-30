#!/bin/bash
# Linera Flip Market - Deployment Script for testnet_conway
# Run this after Linera CLI is installed

set -e  # Exit on any error

echo "=========================================="
echo "Linera Flip Market Deployment"
echo "=========================================="
echo ""

# Step 1: Verify Linera CLI
echo "Step 1: Verifying Linera CLI..."
if ! command -v linera &> /dev/null; then
    echo "ERROR: linera CLI not found!"
    echo "Please install linera CLI first."
    exit 1
fi

linera --version
echo "✅ Linera CLI found"
echo ""

# Step 2: Navigate to project
echo "Step 2: Navigating to project directory..."
cd /mnt/c/Users/shelby/Desktop/Linera-flip-market
echo "✅ In project directory: $(pwd)"
echo ""

# Step 3: Verify WASM binaries exist
echo "Step 3: Verifying WASM binaries..."
if [ ! -f "target/wasm32-unknown-unknown/release/flip_market_contract.wasm" ]; then
    echo "ERROR: Contract WASM not found!"
    echo "Run: cargo build --release --target wasm32-unknown-unknown"
    exit 1
fi

if [ ! -f "target/wasm32-unknown-unknown/release/flip_market_service.wasm" ]; then
    echo "ERROR: Service WASM not found!"
    echo "Run: cargo build --release --target wasm32-unknown-unknown"
    exit 1
fi

echo "✅ Contract WASM: $(ls -lh target/wasm32-unknown-unknown/release/flip_market_contract.wasm | awk '{print $5}')"
echo "✅ Service WASM: $(ls -lh target/wasm32-unknown-unknown/release/flip_market_service.wasm | awk '{print $5}')"
echo ""

# Step 4: Initialize wallet (if needed)
echo "Step 4: Checking wallet..."
if [ ! -f "$HOME/.config/linera/wallet.json" ]; then
    echo "Initializing Linera wallet for testnet Conway..."
    linera wallet init --with-new-chain --faucet https://faucet.testnet-conway.linera.net
    echo "✅ Wallet initialized"
else
    echo "✅ Wallet already exists"
fi
echo ""

# Step 5: Deploy application
echo "Step 5: Deploying Flip Market application..."
echo "Running: linera project publish-and-create ."
echo ""

linera project publish-and-create .

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Copy the Application ID from above"
echo "2. Start the service: linera service --port 8080"
echo "3. Access GraphQL: http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID>"
echo ""
