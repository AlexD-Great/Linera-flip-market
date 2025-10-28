# 🚀 Linera Flip Market - Testnet Deployment Guide

## 📋 Overview

This guide covers deploying the Linera Flip Market smart contract to the Linera testnet (testnet_conway).

---

## 🎯 Deployment Options

### Option 1: Docker (Recommended for Windows)
### Option 2: Native Installation (Linux/Mac)
### Option 3: Use Existing Testnet Node

---

## 🐳 Option 1: Docker Deployment (Recommended)

### Prerequisites
- Docker Desktop installed
- Git installed
- Rust toolchain installed

### Step 1: Build the Contract

```bash
# Navigate to project directory
cd linera-flip-market

# Install wasm32 target if not already installed
rustup target add wasm32-unknown-unknown

# Build the contract
cargo build --release --target wasm32-unknown-unknown
```

The compiled WASM files will be in:
- `target/wasm32-unknown-unknown/release/flip_market_contract.wasm`
- `target/wasm32-unknown-unknown/release/flip_market_service.wasm`

### Step 2: Run Linera Node with Docker

```bash
# Pull the latest Linera Docker image
docker pull ghcr.io/linera-io/linera:latest

# Run a local Linera node
docker run -it --rm \
  -v $(pwd):/app \
  -w /app \
  ghcr.io/linera-io/linera:latest \
  bash
```

### Step 3: Initialize Wallet (Inside Docker)

```bash
# Initialize a new wallet
linera wallet init --with-new-chain

# This creates:
# - A new wallet with a default chain
# - Configuration files
# - Initial tokens for testing
```

### Step 4: Deploy Contract (Inside Docker)

```bash
# Publish the bytecode
BYTECODE_ID=$(linera project publish-bytecode \
  target/wasm32-unknown-unknown/release/flip_market_contract.wasm \
  target/wasm32-unknown-unknown/release/flip_market_service.wasm)

echo "Bytecode ID: $BYTECODE_ID"

# Create an application instance
APPLICATION_ID=$(linera project create-application $BYTECODE_ID)

echo "Application ID: $APPLICATION_ID"

# Save these IDs - you'll need them for the frontend!
```

### Step 5: Get Node Information

```bash
# Get your node's GraphQL endpoint
linera service

# This will output something like:
# GraphQL endpoint: http://localhost:8080
# Chain ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
```

---

## 💻 Option 2: Native Installation (Linux/Mac)

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install required tools
sudo apt-get update
sudo apt-get install -y build-essential pkg-config libssl-dev protobuf-compiler
```

### Install Linera CLI

```bash
# Clone Linera protocol
git clone https://github.com/linera-io/linera-protocol.git -b testnet_conway
cd linera-protocol

# Build Linera CLI
cargo build --release -p linera-service

# Add to PATH
export PATH="$PWD/target/release:$PATH"

# Verify installation
linera --version
```

### Deploy to Testnet

```bash
# Navigate to your project
cd ../linera-flip-market

# Initialize wallet
linera wallet init --with-new-chain

# Build contract
cargo build --release --target wasm32-unknown-unknown

# Deploy
linera project publish-and-create
```

---

## 🌐 Option 3: Connect to Existing Testnet

### Prerequisites
- Linera wallet configured
- Access to a testnet node

### Configuration

Create `.linera/config.json`:
```json
{
  "chains": {
    "default": "your-chain-id"
  },
  "validators": {
    "testnet": {
      "url": "https://testnet.linera.io",
      "public_key": "..."
    }
  }
}
```

### Deploy

```bash
# Set testnet endpoint
export LINERA_WALLET=~/.linera/wallet.json
export LINERA_STORAGE=~/.linera/storage.db

# Deploy contract
linera project publish-and-create
```

---

## 📝 Post-Deployment Steps

### 1. Save Deployment Information

Create `deployment-info.json`:
```json
{
  "bytecode_id": "YOUR_BYTECODE_ID",
  "application_id": "YOUR_APPLICATION_ID",
  "chain_id": "YOUR_CHAIN_ID",
  "graphql_endpoint": "http://localhost:8080",
  "deployed_at": "2025-10-28T13:00:00Z"
}
```

### 2. Update Frontend Configuration

Create `web/.env.local`:
```env
NEXT_PUBLIC_LINERA_GRAPHQL_ENDPOINT=http://localhost:8080
NEXT_PUBLIC_APPLICATION_ID=YOUR_APPLICATION_ID
NEXT_PUBLIC_CHAIN_ID=YOUR_CHAIN_ID
```

### 3. Test the Deployment

```bash
# Query the application
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ flips { id creator betAmount status } }"
  }'
```

---

## 🔧 Troubleshooting

### Issue: "Command not found: linera"
**Solution**: Ensure Linera CLI is in your PATH or use Docker

### Issue: "Failed to connect to validator"
**Solution**: Check your network connection and validator endpoint

### Issue: "Insufficient funds"
**Solution**: Request testnet tokens from faucet (if available)

### Issue: "WASM compilation failed"
**Solution**: 
```bash
rustup target add wasm32-unknown-unknown
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

---

## 📊 Verify Deployment

### Check Contract State
```bash
linera query-application $APPLICATION_ID
```

### Check Chain Status
```bash
linera query-chain $CHAIN_ID
```

### Test Operations
```bash
# Create a flip
linera execute-operation $APPLICATION_ID \
  '{"CreateFlip": {"bet_amount": "1000000"}}'

# Query flips
curl -X POST $GRAPHQL_ENDPOINT/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ flips { id status } }"}'
```

---

## 🎯 For Buildathon Submission

### Required Information
1. ✅ Bytecode ID
2. ✅ Application ID
3. ✅ Chain ID
4. ✅ GraphQL Endpoint
5. ✅ Deployment timestamp
6. ✅ Test transaction hashes

### Documentation to Include
- Deployment logs
- Contract addresses
- Test results
- Screenshots of successful deployment

---

## 📧 Support

If you encounter issues:
- Check Linera Discord: https://discord.gg/linera
- GitHub Issues: https://github.com/linera-io/linera-protocol/issues
- Documentation: https://linera.dev

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Build
cargo build --release --target wasm32-unknown-unknown

# 2. Deploy (with Docker)
docker run -it --rm -v $(pwd):/app -w /app ghcr.io/linera-io/linera:latest bash
linera wallet init --with-new-chain
linera project publish-and-create

# 3. Save IDs and update frontend
# 4. Test deployment
# 5. Submit to buildathon!
```

---

**Last Updated**: October 28, 2025  
**Linera Version**: testnet_conway  
**Status**: Ready for deployment
