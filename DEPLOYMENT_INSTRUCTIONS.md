# 🚀 Linera Flip Market - Complete Deployment Instructions

## ✅ What We Fixed

Based on the judge's feedback, we've corrected the following issues:

1. ✅ **Fixed contract to use proper Linera Views pattern** - Now using `FlipMarketState::load()` with `root_view_storage_context()`
2. ✅ **Fixed service to use proper Linera Views pattern** - Proper state loading and GraphQL integration
3. ✅ **Implemented state persistence** - The `store()` method now properly saves state
4. ✅ **Added GraphQL support** - State structures now have proper async-graphql derives
5. ✅ **Cleaned up code structure** - Removed duplicates, proper module organization

## 📋 Prerequisites

Before deploying, ensure you have:

### Required:
- ✅ **Rust** (latest stable) - https://rustup.rs/
- ✅ **wasm32-unknown-unknown target** - `rustup target add wasm32-unknown-unknown`
- ✅ **Linera CLI** - See installation options below
- ✅ **Git** - https://git-scm.com/

### Optional (for frontend):
- ⚠️ **Node.js** (v18+) - https://nodejs.org/
- ⚠️ **npm** or **yarn**

## 🔧 Installing Linera CLI on Windows

### Option 1: WSL2 (Recommended)

This is the most reliable method for Windows users:

```powershell
# Install WSL2
wsl --install

# Restart your computer, then open WSL2 terminal
wsl

# Inside WSL2, install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install dependencies
sudo apt update
sudo apt install -y build-essential pkg-config libssl-dev protobuf-compiler clang

# Clone Linera protocol (testnet_conway branch)
git clone https://github.com/linera-io/linera-protocol.git -b testnet_conway
cd linera-protocol

# Build Linera CLI
cargo build --release -p linera-service

# Add to PATH (add this to ~/.bashrc for persistence)
export PATH="$PWD/target/release:$PATH"

# Verify installation
linera --version
```

### Option 2: Native Windows Build

```powershell
# Clone Linera protocol
git clone https://github.com/linera-io/linera-protocol.git -b testnet_conway
cd linera-protocol

# Build (this may take 15-30 minutes)
cargo build --release -p linera-service

# Add target/release to your PATH
$env:PATH += ";$PWD\target\release"

# Verify
linera --version
```

## 🏗️ Building the Contract

### Step 1: Check Prerequisites

Run the prerequisite checker:

```powershell
# In PowerShell
.\check-prerequisites.ps1
```

### Step 2: Build WASM Binaries

```powershell
# Navigate to project directory
cd c:\Users\shelby\Desktop\Linera-flip-market

# Build for WASM
cargo build --release --target wasm32-unknown-unknown
```

This will create:
- `target/wasm32-unknown-unknown/release/flip_market_contract.wasm`
- `target/wasm32-unknown-unknown/release/flip_market_service.wasm`

**Expected build time:** 5-10 minutes on first build

## 🌐 Deploying to Testnet Conway

### Method 1: Using the Deployment Script (Recommended)

```powershell
# Run the deployment script
.\deploy-testnet.ps1
```

This script will:
1. Build WASM binaries
2. Check for Linera CLI
3. Initialize wallet (if needed)
4. Deploy to testnet Conway
5. Save deployment information

### Method 2: Manual Deployment

```bash
# Step 1: Initialize wallet (first time only)
linera wallet init --with-new-chain

# Step 2: Build WASM
cargo build --release --target wasm32-unknown-unknown

# Step 3: Deploy using linera project command
linera project publish-and-create .

# This will output your Application ID - save it!
```

### What to Expect

When deployment succeeds, you'll see output like:

```
Bytecode ID: <bytecode_id>
Application ID: <application_id>
Chain ID: <chain_id>
```

**Save these IDs!** You'll need them for the frontend.

## 🖥️ Starting the Linera Service

After deployment, start the Linera service to expose the GraphQL endpoint:

```bash
# Start service on port 8080
linera service --port 8080
```

Your application will be available at:
```
http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID>
```

## 🎨 Connecting the Frontend

### Step 1: Create Environment File

Create `web/.env.local`:

```env
NEXT_PUBLIC_LINERA_GRAPHQL_ENDPOINT=http://localhost:8080
NEXT_PUBLIC_APPLICATION_ID=<your_application_id>
NEXT_PUBLIC_CHAIN_ID=<your_chain_id>
```

### Step 2: Update Frontend Code

The frontend needs to be updated to:
1. Request chain on page load (as per judge's feedback)
2. Connect to Linera GraphQL endpoint instead of mock API
3. Use Linera wallet instead of MetaMask

**Note:** Frontend updates are in progress. The current frontend uses mock data and MetaMask, which needs to be replaced with Linera integration.

### Step 3: Install Dependencies and Run

```bash
cd web
npm install
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🧪 Testing the Deployment

### Test 1: Query the Application

```bash
# Using curl
curl -X POST http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID> \
  -H "Content-Type: application/json" \
  -d '{"query": "{ flips { id creator betAmount status } }"}'
```

### Test 2: Create a Flip

```bash
# Using GraphQL mutation
curl -X POST http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createFlip(betAmount: \"1000000\") }"
  }'
```

### Test 3: Check Leaderboard

```bash
curl -X POST http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID> \
  -H "Content-Type: application/json" \
  -d '{"query": "{ leaderboard { player wins } }"}'
```

## 📝 For Buildathon Submission

### Required Evidence

1. ✅ **Bytecode ID** - From deployment output
2. ✅ **Application ID** - From deployment output
3. ✅ **Chain ID** - From deployment output
4. ✅ **GraphQL Endpoint** - `http://localhost:8080` or your public endpoint
5. ✅ **Deployment Timestamp** - Saved in `deployment-info.json`
6. ✅ **Test Transaction Hashes** - From test operations

### Documentation to Include

- Screenshots of successful deployment
- GraphQL query results
- Contract state verification
- Frontend connected to live contract (showing chain request)

## 🐛 Troubleshooting

### Issue: "cargo: command not found"

**Solution:** Ensure Rust is installed and in PATH:
```powershell
# Check if Rust is installed
rustc --version

# If not, install from https://rustup.rs/
# Then restart your terminal
```

### Issue: "linera: command not found"

**Solution:** Install Linera CLI using WSL2 or build from source (see above)

### Issue: "wasm32-unknown-unknown target not found"

**Solution:**
```bash
rustup target add wasm32-unknown-unknown
```

### Issue: "Failed to load state"

**Solution:** This was fixed in our code updates. Make sure you're using the latest code with proper Views pattern.

### Issue: Build fails with "cannot find crate"

**Solution:**
```bash
# Clean and rebuild
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

### Issue: "Permission denied" on wallet

**Solution:**
```bash
# Check wallet permissions
chmod 600 ~/.linera/wallet.json
chmod 600 ~/.linera/keystore.json
```

## 📊 Deployment Checklist

Before submitting to the buildathon, verify:

- [ ] Contract builds successfully
- [ ] Service builds successfully
- [ ] Wallet initialized
- [ ] Application deployed to testnet Conway
- [ ] Application ID saved
- [ ] Linera service running
- [ ] GraphQL endpoint accessible
- [ ] Can query flips
- [ ] Can create flip
- [ ] Can place bet
- [ ] Leaderboard updates correctly
- [ ] Frontend requests chain on page load
- [ ] Frontend connected to live contract
- [ ] All deployment info documented

## 🎯 Key Changes Made

### Backend (Contract & Service)

1. **contract.rs:**
   - Changed from `key_value_store()` to `FlipMarketState::load(runtime.root_view_storage_context())`
   - Fixed `store()` method to call `self.state.save().await`
   - Updated all MapView operations to use async API with references

2. **service.rs:**
   - Changed from `key_value_store()` to `FlipMarketState::load(runtime.root_view_storage_context())`
   - Fixed GraphQL queries to use `indices()` and async `get()` for MapView iteration
   - Added proper mutations for `createFlip` and `placeBet`

3. **state.rs:**
   - Added `async_graphql::SimpleObject` derive to `Flip` and `FlipMarketState`
   - Added `async_graphql::Enum` derive to `CoinSide`
   - Kept Views-based state management

4. **lib.rs:**
   - Simplified to only contain ABI definitions
   - Removed duplicate type definitions
   - Proper imports from `linera_sdk::base`

### Frontend (To Be Updated)

The frontend currently uses:
- ❌ MetaMask for wallet connection
- ❌ Mock API for data
- ❌ No chain request on page load

Needs to be updated to:
- ✅ Linera wallet integration
- ✅ Real GraphQL endpoint
- ✅ Request chain on page load (as per judge's feedback)

## 📚 Resources

- **Linera Documentation:** https://linera.dev
- **Linera GitHub:** https://github.com/linera-io/linera-protocol
- **Testnet Conway Branch:** https://github.com/linera-io/linera-protocol/tree/testnet_conway
- **Discord Support:** https://discord.gg/linera
- **Hackathon Canon:** See `Hackhathon_canon.md` in this repository

## 🚀 Quick Start Summary

```powershell
# 1. Check prerequisites
.\check-prerequisites.ps1

# 2. Build WASM
cargo build --release --target wasm32-unknown-unknown

# 3. Deploy
.\deploy-testnet.ps1

# 4. Start service
linera service --port 8080

# 5. Test
curl -X POST http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID> \
  -H "Content-Type: application/json" \
  -d '{"query": "{ flips { id creator status } }"}'
```

---

**Last Updated:** November 23, 2025  
**Linera Version:** testnet_conway  
**Status:** ✅ Backend ready for deployment | ⚠️ Frontend needs Linera integration
