# 🚀 Deploy Linera Flip Market to Testnet Conway via WSL

## ✅ What We Have Ready
- ✅ WASM binaries compiled (contract: 185KB, service: 1MB)
- ✅ Testnet faucet URL: https://faucet.testnet-conway.linera.net/
- ✅ WSL available on your system

---

## 📋 Step-by-Step Deployment Guide

### **Step 1: Install WSL + Ubuntu**

Open PowerShell as Administrator and run:

```powershell
wsl --install -d Ubuntu-24.04
```

**This will:**
- Install WSL2
- Install Ubuntu 24.04 LTS
- Prompt you to create a username and password

**After installation:**
- Restart your computer if prompted
- Launch "Ubuntu" from Start Menu
- Create your username/password when prompted

---

### **Step 2: Setup Ubuntu Environment**

Once in Ubuntu terminal, run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Add WASM target
rustup target add wasm32-unknown-unknown

# Install build dependencies
sudo apt install -y build-essential pkg-config libssl-dev protobuf-compiler

# Install git
sudo apt install -y git

# Verify installations
rustc --version
cargo --version
protoc --version
```

---

### **Step 3: Clone Linera Protocol & Build CLI**

```bash
# Create workspace
mkdir -p ~/linera-workspace
cd ~/linera-workspace

# Clone Linera protocol
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol

# Checkout testnet_conway branch
git checkout testnet_conway

# Build Linera CLI (this takes 10-15 minutes)
cargo build --release -p linera-service

# Add to PATH
export PATH="$HOME/linera-workspace/linera-protocol/target/release:$PATH"

# Verify
linera --version
```

---

### **Step 4: Copy WASM Files to WSL**

From Windows PowerShell, copy your WASM files to WSL:

```powershell
# Copy contract
wsl cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release/flip_market_contract.wasm ~/linera-workspace/

# Copy service
wsl cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release/flip_market_service.wasm ~/linera-workspace/
```

Or from within WSL:

```bash
# Create directory
mkdir -p ~/linera-workspace/flip-market-wasm

# Copy files
cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release/flip_market_contract.wasm ~/linera-workspace/flip-market-wasm/
cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release/flip_market_service.wasm ~/linera-workspace/flip-market-wasm/

# Verify files
ls -lh ~/linera-workspace/flip-market-wasm/
```

---

### **Step 5: Setup Linera Wallet for Testnet**

```bash
# Set environment variables
export LINERA_WALLET="$HOME/.linera/testnet-wallet.json"
export LINERA_KEYSTORE="$HOME/.linera/testnet-keystore.json"
export LINERA_STORAGE="rocksdb:$HOME/.linera/testnet-client.db"
export LINERA_FAUCET_URL="https://faucet.testnet-conway.linera.net"

# Initialize wallet with testnet faucet
linera wallet init --faucet $LINERA_FAUCET_URL

# This will output your default chain ID - SAVE THIS!
# Example output:
# Wallet initialized successfully
# Default chain: e476187f6ddfeb9d588c7e2d...
```

---

### **Step 6: Request a Chain from Faucet**

```bash
# Request a new chain with tokens
linera wallet request-chain --faucet $LINERA_FAUCET_URL

# Check your balance
linera query-balance

# List your chains
linera wallet show
```

---

### **Step 7: Deploy Your Contract! 🚀**

```bash
# Navigate to WASM files
cd ~/linera-workspace/flip-market-wasm

# Deploy contract and service
linera publish-and-create \
  flip_market_contract.wasm \
  flip_market_service.wasm

# IMPORTANT: Save the output!
# You'll get an APPLICATION_ID like:
# Application created successfully!
# Application ID: e476187f6ddfeb9d588c7e2d...01234567
# Chain ID: e476187f6ddfeb9d588c7e2d...
```

**SAVE THESE VALUES:**
- `APPLICATION_ID`: Your deployed app's unique identifier
- `CHAIN_ID`: Your chain's identifier

---

### **Step 8: Start the Service**

```bash
# Start the Linera service (GraphQL endpoint)
linera service --port 8080

# Your app will be accessible at:
# http://localhost:8080/chains/{CHAIN_ID}/applications/{APPLICATION_ID}
```

**Keep this terminal open!** The service needs to run continuously.

---

### **Step 9: Test Your Deployment**

Open a new terminal (or new WSL session) and test:

```bash
# Test GraphQL endpoint
curl http://localhost:8080/chains/{YOUR_CHAIN_ID}/applications/{YOUR_APP_ID}

# Or use GraphQL query
curl -X POST http://localhost:8080/chains/{YOUR_CHAIN_ID}/applications/{YOUR_APP_ID} \
  -H "Content-Type: application/json" \
  -d '{"query": "{ flips { id creator betAmount status } }"}'
```

---

## 🎯 Quick Reference Commands

### **Environment Variables (add to ~/.bashrc)**

```bash
# Add these to ~/.bashrc for persistence
echo 'export PATH="$HOME/linera-workspace/linera-protocol/target/release:$PATH"' >> ~/.bashrc
echo 'export LINERA_WALLET="$HOME/.linera/testnet-wallet.json"' >> ~/.bashrc
echo 'export LINERA_KEYSTORE="$HOME/.linera/testnet-keystore.json"' >> ~/.bashrc
echo 'export LINERA_STORAGE="rocksdb:$HOME/.linera/testnet-client.db"' >> ~/.bashrc
echo 'export LINERA_FAUCET_URL="https://faucet.testnet-conway.linera.net"' >> ~/.bashrc

# Reload
source ~/.bashrc
```

### **Useful Commands**

```bash
# Check balance
linera query-balance

# List chains
linera wallet show

# Request more tokens
linera wallet request-chain --faucet $LINERA_FAUCET_URL

# View wallet info
cat $LINERA_WALLET

# Check service status
curl http://localhost:8080/
```

---

## 🔧 Troubleshooting

### **Issue: "linera: command not found"**
```bash
export PATH="$HOME/linera-workspace/linera-protocol/target/release:$PATH"
```

### **Issue: "Failed to connect to faucet"**
- Check internet connection
- Verify faucet URL: https://faucet.testnet-conway.linera.net/
- Try again in a few minutes

### **Issue: "WASM file not found"**
```bash
# Verify files exist
ls -lh ~/linera-workspace/flip-market-wasm/
```

### **Issue: "Port 8080 already in use"**
```bash
# Use different port
linera service --port 8081
```

---

## 📝 After Deployment Checklist

- [ ] Save APPLICATION_ID
- [ ] Save CHAIN_ID
- [ ] Save GraphQL endpoint URL
- [ ] Test GraphQL queries
- [ ] Take screenshots
- [ ] Update frontend with endpoint
- [ ] Document deployment in README

---

## 🎨 Connect Your Frontend

Once deployed, update your frontend configuration:

```javascript
// Update these values in your frontend
const LINERA_ENDPOINT = "http://localhost:8080";
const CHAIN_ID = "YOUR_CHAIN_ID_HERE";
const APPLICATION_ID = "YOUR_APPLICATION_ID_HERE";

const graphqlEndpoint = `${LINERA_ENDPOINT}/chains/${CHAIN_ID}/applications/${APPLICATION_ID}`;
```

---

## 🏆 Wave 2 Submission

After successful deployment, you'll have:

✅ Deployed contract on Testnet Conway  
✅ Working GraphQL endpoint  
✅ APPLICATION_ID and CHAIN_ID  
✅ Live dApp ready for testing  

**Next Steps:**
1. Connect frontend to deployed contract
2. Test all operations (CreateFlip, PlaceBet)
3. Record demo video
4. Take screenshots
5. Submit to Linera Buildathon!

---

## 💡 Pro Tips

1. **Keep service running**: The `linera service` command must stay running
2. **Use tmux/screen**: To keep service running in background
3. **Save everything**: Keep all IDs and URLs in a safe place
4. **Test thoroughly**: Try all operations before submission
5. **Document well**: Take screenshots of every step

---

**Good luck with deployment! 🚀**

*Testnet Conway Faucet: https://faucet.testnet-conway.linera.net/*
