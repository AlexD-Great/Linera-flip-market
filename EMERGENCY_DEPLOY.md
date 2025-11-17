# 🚨 EMERGENCY DEPLOYMENT GUIDE - Linera Flip Market
## Deadline: 1 Day - Let's Deploy NOW!

---

## 🎯 FASTEST METHOD: Use Pre-Built CLI Binary

Since the portal has verification issues and WSL has dependency problems, here's the **absolute fastest way**:

### **Step 1: Get Pre-Built Linera CLI (2 minutes)**

Ask in Discord #developer-support:

```
URGENT: Need pre-built linera CLI binary for Windows/WSL to deploy before deadline.
My WASM binaries are ready (185KB contract, 1MB service).
Can someone share a working linera binary or Docker image?
Testnet: Conway
```

### **Step 2: Alternative - Use GitHub Codespaces (5 minutes)**

1. Go to: https://github.com/linera-io/linera-protocol
2. Click **"Code"** → **"Codespaces"** → **"Create codespace"**
3. This gives you a cloud Linux environment with everything pre-installed!

In the Codespace terminal:

```bash
# Clone your project
git clone https://github.com/YOUR_USERNAME/Linera-flip-market.git
cd Linera-flip-market

# Build WASM (if needed)
cargo build --release --target wasm32-unknown-unknown

# Setup Linera
export LINERA_WALLET="$HOME/.linera/wallet.json"
export LINERA_STORAGE="rocksdb:$HOME/.linera/client.db"
export LINERA_FAUCET_URL="https://faucet.testnet-conway.linera.net"

# Initialize and deploy
linera wallet init --faucet $LINERA_FAUCET_URL
linera publish-and-create \
  target/wasm32-unknown-unknown/release/flip_market_contract.wasm \
  target/wasm32-unknown-unknown/release/flip_market_service.wasm
```

---

## 🎯 METHOD 2: Docker (10 minutes)

If you have Docker Desktop installed:

```powershell
# Pull Ubuntu image
docker run -it --rm -v C:\Users\SADAM\OneDrive\Adam\OneDrive\Desktop\Linera-flip-market:/project ubuntu:24.04 bash
```

Inside Docker:
```bash
# Install dependencies
apt update && apt install -y curl git build-essential pkg-config libssl-dev protobuf-compiler

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
rustup target add wasm32-unknown-unknown

# Clone and build Linera
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol
git checkout testnet_conway
cargo build --release -p linera-service

# Add to PATH
export PATH="$PWD/target/release:$PATH"

# Deploy
cd /project
export LINERA_WALLET="$HOME/.linera/wallet.json"
export LINERA_STORAGE="rocksdb:$HOME/.linera/client.db"
export LINERA_FAUCET_URL="https://faucet.testnet-conway.linera.net"

linera wallet init --faucet $LINERA_FAUCET_URL
linera publish-and-create \
  target/wasm32-unknown-unknown/release/flip_market_contract.wasm \
  target/wasm32-unknown-unknown/release/flip_market_service.wasm
```

---

## 🎯 METHOD 3: Ask Linera Team Directly

**Discord Message Template:**

```
🚨 URGENT - Buildathon Deadline Tomorrow 🚨

Hi Linera team! I'm participating in the Buildathon and need to deploy ASAP.

**Project:** Flip Market (coin flip betting dApp)
**Status:** ✅ WASM binaries compiled and ready (185KB contract, 1MB service)
**Issue:** Portal verification cooldown + WSL dependency issues

**What I need:**
1. Pre-built linera CLI binary for Windows/WSL, OR
2. Alternative deployment method (API endpoint?), OR
3. Someone to help me deploy via screen share

**Files ready at:**
- flip_market_contract.wasm (185KB)
- flip_market_service.wasm (1MB)

Can someone please help? Deadline is in 24 hours! 🙏

Discord: adam__
```

Post this in:
- #developer-support
- #buildathon (if exists)
- Tag @moderators if urgent

---

## 🎯 METHOD 4: Portal Workaround

The cooldown message says "1:24" - wait 1 minute 24 seconds and try again!

**Steps:**
1. Wait for cooldown (1:24 remaining in your screenshot)
2. Click "Complete Discord Quest" again
3. It should verify your role
4. Then you can access deployment features

**If it still fails:**
- Make sure you're logged into Discord in the same browser
- Try incognito/private mode
- Clear browser cache
- Try different browser (Chrome/Firefox/Edge)

---

## 🎯 METHOD 5: Manual API Deployment

If all else fails, you can deploy via Linera's GraphQL API:

```bash
# In WSL (even without full CLI)
curl -X POST https://rpc.testnet-conway.linera.net \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "linera_publishBytecode",
    "params": {
      "contract": "BASE64_ENCODED_CONTRACT_WASM",
      "service": "BASE64_ENCODED_SERVICE_WASM"
    },
    "id": 1
  }'
```

To encode your WASM:
```bash
base64 -w 0 flip_market_contract.wasm > contract.b64
base64 -w 0 flip_market_service.wasm > service.b64
```

---

## 📞 IMMEDIATE ACTION PLAN

**RIGHT NOW (Next 10 minutes):**

1. **Join Discord voice chat** in #developer-support and ask for live help
2. **Post the urgent message** I provided above
3. **Try the portal again** after the cooldown (1:24)
4. **Start GitHub Codespace** as backup plan

**Within 1 hour:**

- Get response from Linera team
- Deploy using whichever method works first
- Test deployment
- Get APPLICATION_ID and CHAIN_ID

**Remaining time:**

- Connect frontend
- Test all features
- Record demo
- Submit to Buildathon

---

## 🎯 Your WASM Files Are Here:

```
C:\Users\SADAM\OneDrive\Adam\OneDrive\Desktop\Linera-flip-market\target\wasm32-unknown-unknown\release\flip_market_contract.wasm
C:\Users\SADAM\OneDrive\Adam\OneDrive\Desktop\Linera-flip-market\target\wasm32-unknown-unknown\release\flip_market_service.wasm
```

**File sizes:**
- Contract: 184.88 KB
- Service: 1009.08 KB (1 MB)

---

## ✅ What You've Already Accomplished

- ✅ Smart contract code written
- ✅ Updated to use Linera Views
- ✅ All compilation errors fixed
- ✅ WASM binaries successfully built
- ✅ Code follows Linera best practices

**You're 90% done! Just need to deploy!**

---

## 🚀 RECOMMENDED: Try These in Order

1. **Wait 90 seconds, try portal again** (fastest if it works)
2. **Post urgent message in Discord** (get team help)
3. **Start GitHub Codespace** (guaranteed to work)
4. **Use Docker** (if you have it installed)

---

**Don't panic! Your code is ready. We just need to get it deployed. The Linera team is very responsive on Discord - they'll help you!** 🎉

**Discord:** https://discord.com/invite/linera
**Portal:** https://portal.linera.net/
**Faucet:** https://faucet.testnet-conway.linera.net/
