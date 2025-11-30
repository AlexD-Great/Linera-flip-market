# 🔧 Installing Prerequisites for Linera Deployment

## Current Status

✅ **Git** - Already installed (v2.52.0.windows.1)  
❌ **Rust** - Not installed  
❌ **WSL2** - Not installed  
❌ **Linera CLI** - Not installed

---

## 🚀 Installation Steps

### Step 1: Install WSL2 (Windows Subsystem for Linux)

**This command is currently running in your terminal:**
```powershell
wsl --install -d Ubuntu
```

**What this does:**
- Installs WSL2 feature on Windows
- Downloads and installs Ubuntu Linux
- Sets up a Linux environment on your Windows machine

**Expected time:** 5-10 minutes (depending on internet speed)

**After installation completes:**
1. You'll need to **restart your computer**
2. Ubuntu will launch automatically after restart
3. You'll be asked to create a Linux username and password

---

### Step 2: Set Up Ubuntu (After Restart)

After your computer restarts, Ubuntu will open automatically. Follow these steps:

#### 2.1 Create User Account
```bash
# You'll be prompted to create a username
# Enter a username (lowercase, no spaces)
# Example: shelby

# Then create a password
# Enter password (it won't show as you type - this is normal)
# Re-enter password to confirm
```

#### 2.2 Update Ubuntu
```bash
sudo apt update && sudo apt upgrade -y
```

---

### Step 3: Install Rust in WSL2

Once Ubuntu is set up, install Rust:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# When prompted, press 1 and Enter for default installation

# Load Rust into current session
source $HOME/.cargo/env

# Verify installation
rustc --version
cargo --version
```

**Expected output:**
```
rustc 1.xx.x (...)
cargo 1.xx.x (...)
```

---

### Step 4: Install Build Dependencies

```bash
# Install required build tools
sudo apt install -y build-essential pkg-config libssl-dev protobuf-compiler clang
```

---

### Step 5: Add wasm32 Target

```bash
# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Verify
rustup target list --installed | grep wasm32
```

**Expected output:**
```
wasm32-unknown-unknown
```

---

### Step 6: Install Linera CLI

```bash
# Clone Linera protocol (testnet_conway branch)
cd ~
git clone https://github.com/linera-io/linera-protocol.git -b testnet_conway
cd linera-protocol

# Build Linera CLI (this takes 15-30 minutes)
cargo build --release -p linera-service

# Add to PATH
echo 'export PATH="$HOME/linera-protocol/target/release:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
linera --version
```

**Expected output:**
```
linera x.x.x
```

---

### Step 7: Access Your Project in WSL2

Your Windows files are accessible in WSL2 at `/mnt/c/`:

```bash
# Navigate to your project
cd /mnt/c/Users/shelby/Desktop/Linera-flip-market

# Verify you're in the right place
ls -la
```

You should see your project files: `Cargo.toml`, `src/`, `web/`, etc.

---

## ✅ Verification Checklist

After completing all steps, verify everything is installed:

```bash
# Check Rust
rustc --version

# Check Cargo
cargo --version

# Check wasm32 target
rustup target list --installed | grep wasm32

# Check Linera CLI
linera --version

# Check Git
git --version
```

**All commands should return version numbers without errors.**

---

## 🚀 Ready to Deploy!

Once all prerequisites are installed, you can deploy:

```bash
# Navigate to project
cd /mnt/c/Users/shelby/Desktop/Linera-flip-market

# Build WASM
cargo build --release --target wasm32-unknown-unknown

# Deploy to testnet
linera project publish-and-create .

# Start service
linera service --port 8080
```

---

## 🐛 Troubleshooting

### Issue: "wsl --install" fails

**Solution 1:** Enable virtualization in BIOS
- Restart computer
- Enter BIOS (usually F2, F10, or Del key during boot)
- Enable "Intel VT-x" or "AMD-V" virtualization
- Save and restart

**Solution 2:** Run as Administrator
- Open PowerShell as Administrator
- Run: `wsl --install -d Ubuntu`

### Issue: Ubuntu doesn't launch after restart

**Solution:**
```powershell
# Manually launch Ubuntu
wsl -d Ubuntu
```

### Issue: "cargo: command not found" in WSL

**Solution:**
```bash
# Reload environment
source $HOME/.cargo/env

# Or restart WSL
exit
wsl -d Ubuntu
```

### Issue: Linera build takes too long

**Solution:**
- This is normal! Building Linera from source takes 15-30 minutes
- Make sure you have a stable internet connection
- Don't interrupt the build process

### Issue: Permission denied errors

**Solution:**
```bash
# Fix ownership of project files
sudo chown -R $USER:$USER /mnt/c/Users/shelby/Desktop/Linera-flip-market
```

---

## 📝 Quick Reference

### Open WSL from Windows
```powershell
# From PowerShell or Command Prompt
wsl
```

### Access Windows files from WSL
```bash
# Windows C: drive is at /mnt/c/
cd /mnt/c/Users/shelby/Desktop/Linera-flip-market
```

### Access WSL files from Windows
```
\\wsl$\Ubuntu\home\<your-username>\
```

### Stop WSL
```powershell
wsl --shutdown
```

### Restart WSL
```powershell
wsl --shutdown
wsl -d Ubuntu
```

---

## ⏱️ Estimated Time

| Step | Time |
|------|------|
| WSL2 Installation | 5-10 minutes |
| Computer Restart | 2-3 minutes |
| Ubuntu Setup | 2-5 minutes |
| Rust Installation | 5-10 minutes |
| Dependencies | 5-10 minutes |
| Linera CLI Build | 15-30 minutes |
| **Total** | **35-70 minutes** |

---

## 🎯 Next Steps After Installation

1. ✅ Verify all prerequisites are installed
2. ✅ Navigate to project in WSL: `cd /mnt/c/Users/shelby/Desktop/Linera-flip-market`
3. ✅ Build WASM: `cargo build --release --target wasm32-unknown-unknown`
4. ✅ Deploy: `linera project publish-and-create .`
5. ✅ Start service: `linera service --port 8080`
6. ✅ Test deployment

---

## 📞 Need Help?

- **Linera Discord:** https://discord.gg/linera
- **WSL Documentation:** https://docs.microsoft.com/en-us/windows/wsl/
- **Rust Documentation:** https://www.rust-lang.org/learn

---

**Status:** WSL2 installation is currently running. Please wait for it to complete, then restart your computer.
