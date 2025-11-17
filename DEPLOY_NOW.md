# 🚀 Deploy Linera Flip Market NOW - Step by Step

## ⏱️ Total Time: ~20 minutes

---

## ✅ Current Status

Your WSL installation is in progress! Here's what to do next:

---

## 📋 Step-by-Step Instructions

### **Step 1: Complete WSL Installation** ⏳ (Currently Running)

The command `wsl --install -d Ubuntu-24.04` is running in the background.

**What will happen:**
1. WSL will finish installing (may take 5-10 minutes)
2. You may be prompted to **restart your computer**
3. After restart, Ubuntu will launch automatically
4. You'll be asked to create a **username** and **password**

**Action Required:**
- ✅ Wait for installation to complete
- ✅ Restart computer if prompted
- ✅ Create username/password when Ubuntu launches

---

### **Step 2: Launch Ubuntu** (After Restart)

**Option A:** Ubuntu launches automatically after restart

**Option B:** If it doesn't launch:
1. Press **Windows Key**
2. Type "Ubuntu"
3. Click "Ubuntu 24.04 LTS"

**First Time Setup:**
```
Installing, this may take a few minutes...
Please create a default UNIX user account...
Enter new UNIX username: [YOUR_USERNAME]
New password: [YOUR_PASSWORD]
Retype new password: [YOUR_PASSWORD]
```

✅ **Choose a simple username** (e.g., `adam`, `dev`, `linera`)
✅ **Remember your password** - you'll need it for `sudo` commands

---

### **Step 3: Run Setup Script** ⏱️ (~15 minutes)

Once you're in the Ubuntu terminal, copy and paste these commands **one by one**:

```bash
# Copy setup script from Windows to WSL
cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/setup-wsl.sh ~/

# Make it executable
chmod +x ~/setup-wsl.sh

# Run the setup script
~/setup-wsl.sh
```

**What this does:**
- ✅ Updates Ubuntu packages
- ✅ Installs Rust and build tools
- ✅ Installs protobuf compiler
- ✅ Clones Linera protocol repository
- ✅ Builds Linera CLI (takes ~10-15 minutes)
- ✅ Copies your WASM files
- ✅ Sets up environment variables

**You'll see:**
```
🔧 Linera Flip Market - WSL Environment Setup
==============================================

Step 1: Updating system packages...
✓ System updated

Step 2: Installing build dependencies...
✓ Dependencies installed

Step 3: Installing Rust...
✓ Rust installed

...

🎉 SETUP COMPLETE!
```

**After it completes, run:**
```bash
source ~/.bashrc
linera --version
```

You should see: `linera 0.15.x`

---

### **Step 4: Deploy to Testnet!** ⏱️ (~2 minutes)

```bash
# Navigate to deployment directory
cd ~/linera-workspace/flip-market-wasm

# Run deployment script
./deploy.sh
```

**What this does:**
- ✅ Checks prerequisites
- ✅ Verifies WASM files (185KB contract, 1MB service)
- ✅ Initializes wallet with testnet faucet
- ✅ Requests chain and tokens
- ✅ Deploys your contract to Testnet Conway
- ✅ Gives you APPLICATION_ID and CHAIN_ID

**You'll see:**
```
🚀 Linera Flip Market - Testnet Conway Deployment
==================================================

Step 1: Checking prerequisites...
✓ Linera CLI found

Step 2: Checking WASM files...
✓ WASM files found
  Contract: 185K
  Service:  1.0M

Step 3: Checking wallet...
Initializing wallet with testnet faucet...
✓ Wallet initialized

Step 4: Checking chain...
Requesting chain from faucet...
✓ Chain requested

Step 5: Deploying contract...
This may take a minute...

========================================
🎉 DEPLOYMENT SUCCESSFUL!
========================================

IMPORTANT: Save these values!

APPLICATION_ID: e476187f6ddfeb9d588c7e2d01234567...
CHAIN_ID: e476187f6ddfeb9d588c7e2d...

GraphQL Endpoint:
http://localhost:8080/chains/[CHAIN_ID]/applications/[APP_ID]

✓ Deployment info saved to: /home/[username]/linera-flip-market-deployment.txt

Step 6: Start service?
Do you want to start the Linera service now? (y/n)
```

**Press `y` to start the service!**

---

### **Step 5: Service Running** ✅

Once you press `y`, you'll see:

```
Starting Linera service on port 8080...
Press Ctrl+C to stop

[INFO] Service started on http://localhost:8080
```

**Keep this terminal open!** The service needs to run continuously.

---

### **Step 6: Test Your Deployment** 🧪

Open a **new Ubuntu terminal** (keep the first one running):

```bash
# Set your values
CHAIN_ID="your_chain_id_here"
APP_ID="your_application_id_here"

# Test the endpoint
curl http://localhost:8080/chains/$CHAIN_ID/applications/$APP_ID

# Query flips
curl -X POST http://localhost:8080/chains/$CHAIN_ID/applications/$APP_ID \
  -H "Content-Type: application/json" \
  -d '{"query": "{ flips { id creator betAmount status } }"}'

# Query leaderboard
curl -X POST http://localhost:8080/chains/$CHAIN_ID/applications/$APP_ID \
  -H "Content-Type: application/json" \
  -d '{"query": "{ leaderboard { player wins } }"}'
```

---

## 📝 Important Information to Save

After deployment, save these to a file:

```
Linera Flip Market - Deployment Info
=====================================

APPLICATION_ID: [from deployment output]
CHAIN_ID: [from deployment output]

GraphQL Endpoint:
http://localhost:8080/chains/[CHAIN_ID]/applications/[APP_ID]

Testnet: Conway
Faucet: https://faucet.testnet-conway.linera.net/

Deployed: [date/time]
```

---

## 🎯 After Deployment Checklist

- [ ] Save APPLICATION_ID
- [ ] Save CHAIN_ID
- [ ] Save GraphQL endpoint URL
- [ ] Test GraphQL queries
- [ ] Service is running
- [ ] Take screenshots
- [ ] Update frontend with endpoint
- [ ] Test all operations
- [ ] Record demo video
- [ ] Prepare Buildathon submission

---

## 🔧 Troubleshooting

### **Issue: "setup-wsl.sh: No such file or directory"**

The file path might be different. Try:
```bash
# Find the file
ls /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/

# If found, copy with full path
cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/setup-wsl.sh ~/
```

### **Issue: "Permission denied"**

```bash
chmod +x ~/setup-wsl.sh
```

### **Issue: Build fails**

Make sure you have internet connection and try again:
```bash
cd ~/linera-workspace/linera-protocol
cargo clean
cargo build --release -p linera-service
```

### **Issue: "linera: command not found"**

```bash
export PATH="$HOME/linera-workspace/linera-protocol/target/release:$PATH"
source ~/.bashrc
```

### **Issue: Faucet connection fails**

- Check internet connection
- Wait a few minutes and try again
- Verify faucet URL: https://faucet.testnet-conway.linera.net/

---

## 💡 Pro Tips

1. **Keep service running** - Don't close the terminal with `linera service`
2. **Use tmux** - To keep service running in background:
   ```bash
   sudo apt install tmux
   tmux new -s linera
   # Run linera service here
   # Press Ctrl+B then D to detach
   # tmux attach -t linera to reattach
   ```
3. **Save everything** - Keep all IDs and URLs
4. **Test thoroughly** - Try all operations before submission

---

## 🎊 Next Steps After Deployment

1. **Connect Frontend**:
   - Update GraphQL endpoint in your web app
   - Test creating flips
   - Test placing bets
   - Test leaderboard

2. **Documentation**:
   - Take screenshots of deployment
   - Record demo video
   - Update README with live deployment info

3. **Buildathon Submission**:
   - Prepare submission materials
   - Include deployment details
   - Show working dApp

---

## 📞 Need Help?

**Linera Discord**: https://discord.com/invite/linera
- Channel: #developer-support
- Very responsive!

**Testnet Faucet**: https://faucet.testnet-conway.linera.net/

---

## ✨ You're Almost There!

Just follow these steps and you'll have your contract live on Testnet Conway!

**Current Progress:**
- ✅ Contract code ready
- ✅ WASM binaries compiled
- ✅ Deployment scripts ready
- ⏳ WSL installing...
- ⏳ Setup script ready to run
- ⏳ Deploy script ready to run

**Estimated time remaining: ~20 minutes**

---

**Good luck! 🚀**
