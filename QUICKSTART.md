# 🚀 Linera Flip Market - Quick Start Guide

## ✅ Current Status

- ✅ **Contract compiled** with Linera Views
- ✅ **WASM binaries ready** (contract: 185KB, service: 1MB)
- ✅ **Testnet faucet URL** obtained: https://faucet.testnet-conway.linera.net/
- ✅ **Deployment scripts** created

---

## 🎯 Deploy in 3 Steps (15-20 minutes)

### **Step 1: Install WSL + Ubuntu (5 minutes)**

Open **PowerShell as Administrator** and run:

```powershell
wsl --install -d Ubuntu-24.04
```

**Then:**
1. Restart computer if prompted
2. Launch "Ubuntu" from Start Menu
3. Create username and password when prompted

---

### **Step 2: Setup Environment (10-15 minutes)**

In the Ubuntu terminal, run:

```bash
# Copy setup script from Windows to WSL
cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/setup-wsl.sh ~/
chmod +x ~/setup-wsl.sh

# Run setup script
~/setup-wsl.sh
```

**This script will:**
- Install Rust, build tools, and dependencies
- Clone Linera protocol
- Build Linera CLI (takes 10-15 min)
- Copy your WASM files
- Setup environment variables

**After it completes:**
```bash
source ~/.bashrc
linera --version  # Verify installation
```

---

### **Step 3: Deploy to Testnet! (2 minutes)**

```bash
# Navigate to deployment directory
cd ~/linera-workspace/flip-market-wasm

# Run deployment script
./deploy.sh
```

**The script will:**
1. ✅ Check prerequisites
2. ✅ Verify WASM files
3. ✅ Initialize wallet with testnet faucet
4. ✅ Request chain and tokens
5. ✅ Deploy your contract
6. ✅ Give you APPLICATION_ID and CHAIN_ID
7. ✅ Start the service (optional)

**Save the output!** You'll get:
- `APPLICATION_ID`: Your app's unique ID
- `CHAIN_ID`: Your chain ID
- GraphQL endpoint URL

---

## 📝 Manual Deployment (If Scripts Don't Work)

### **Setup WSL**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y build-essential pkg-config libssl-dev protobuf-compiler git curl

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup target add wasm32-unknown-unknown

# Clone and build Linera
mkdir -p ~/linera-workspace && cd ~/linera-workspace
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol
git checkout testnet_conway
cargo build --release -p linera-service
export PATH="$HOME/linera-workspace/linera-protocol/target/release:$PATH"
```

### **Copy WASM Files**
```bash
mkdir -p ~/linera-workspace/flip-market-wasm
cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release/flip_market_contract.wasm ~/linera-workspace/flip-market-wasm/
cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release/flip_market_service.wasm ~/linera-workspace/flip-market-wasm/
```

### **Deploy**
```bash
# Set environment
export LINERA_WALLET="$HOME/.linera/testnet-wallet.json"
export LINERA_KEYSTORE="$HOME/.linera/testnet-keystore.json"
export LINERA_STORAGE="rocksdb:$HOME/.linera/testnet-client.db"
export LINERA_FAUCET_URL="https://faucet.testnet-conway.linera.net"

# Initialize wallet
linera wallet init --faucet $LINERA_FAUCET_URL

# Request chain
linera wallet request-chain --faucet $LINERA_FAUCET_URL

# Deploy
cd ~/linera-workspace/flip-market-wasm
linera publish-and-create flip_market_contract.wasm flip_market_service.wasm

# Start service
linera service --port 8080
```

---

## 🧪 Test Your Deployment

### **Check Service**
```bash
# In a new terminal
curl http://localhost:8080/
```

### **Query Your Contract**
```bash
# Replace {CHAIN_ID} and {APP_ID} with your values
curl -X POST http://localhost:8080/chains/{CHAIN_ID}/applications/{APP_ID} \
  -H "Content-Type: application/json" \
  -d '{"query": "{ flips { id creator betAmount status } }"}'
```

### **Check Leaderboard**
```bash
curl -X POST http://localhost:8080/chains/{CHAIN_ID}/applications/{APP_ID} \
  -H "Content-Type: application/json" \
  -d '{"query": "{ leaderboard { player wins } }"}'
```

---

## 📂 Files Created

- `DEPLOY_WSL.md` - Detailed deployment guide
- `setup-wsl.sh` - Automated environment setup script
- `deploy.sh` - Automated deployment script
- `QUICKSTART.md` - This file

---

## 🔧 Troubleshooting

### **"wsl: command not found"**
- WSL not installed. Run in PowerShell as Admin:
  ```powershell
  wsl --install
  ```

### **"linera: command not found"**
```bash
export PATH="$HOME/linera-workspace/linera-protocol/target/release:$PATH"
```

### **"Failed to connect to faucet"**
- Check internet connection
- Verify faucet URL: https://faucet.testnet-conway.linera.net/
- Try again in a few minutes

### **"WASM file not found"**
```bash
# Verify files
ls -lh ~/linera-workspace/flip-market-wasm/

# If missing, copy manually
cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release/*.wasm ~/linera-workspace/flip-market-wasm/
```

---

## 📞 Need Help?

**Linera Discord**: https://discord.com/invite/linera
- Channel: #developer-support
- Very responsive community!

**Testnet Faucet**: https://faucet.testnet-conway.linera.net/

---

## 🎯 After Deployment

1. **Save your IDs**:
   - APPLICATION_ID
   - CHAIN_ID
   - GraphQL endpoint

2. **Test operations**:
   - Create flips
   - Place bets
   - Check leaderboard

3. **Connect frontend**:
   - Update endpoint in your web app
   - Test all features

4. **Document**:
   - Take screenshots
   - Record demo video
   - Update README

5. **Submit**:
   - Prepare Buildathon submission
   - Include all deployment info

---

## ✨ You're Almost There!

Your contract is compiled and ready. Just need to:
1. Install WSL (5 min)
2. Run setup script (15 min)
3. Run deploy script (2 min)

**Total time: ~20 minutes to live deployment! 🚀**

---

**Good luck! 🎉**
