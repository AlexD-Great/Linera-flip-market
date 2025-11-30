#!/bin/bash
# Run this script in WSL2 after installation and restart
# This will install all prerequisites for Linera deployment

echo "=== Linera Flip Market - Prerequisites Installation ==="
echo "This script will install Rust, dependencies, and Linera CLI"
echo ""

# Update system
echo "Step 1: Updating Ubuntu..."
sudo apt update && sudo apt upgrade -y

# Install build dependencies
echo ""
echo "Step 2: Installing build dependencies..."
sudo apt install -y build-essential pkg-config libssl-dev protobuf-compiler clang

# Install Rust
echo ""
echo "Step 3: Installing Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo "✓ Rust installed successfully"
else
    echo "✓ Rust already installed"
fi

# Verify Rust
rustc --version
cargo --version

# Add wasm32 target
echo ""
echo "Step 4: Adding wasm32-unknown-unknown target..."
rustup target add wasm32-unknown-unknown
echo "✓ wasm32 target added"

# Clone and build Linera CLI
echo ""
echo "Step 5: Installing Linera CLI (this takes 15-30 minutes)..."
cd ~
if [ ! -d "linera-protocol" ]; then
    git clone https://github.com/linera-io/linera-protocol.git -b testnet_conway
    cd linera-protocol
    echo "Building Linera CLI... Please be patient, this takes a while."
    cargo build --release -p linera-service
    
    # Add to PATH
    echo 'export PATH="$HOME/linera-protocol/target/release:$PATH"' >> ~/.bashrc
    source ~/.bashrc
    echo "✓ Linera CLI installed"
else
    echo "✓ Linera protocol already cloned"
    cd linera-protocol
    if [ ! -f "target/release/linera" ]; then
        echo "Building Linera CLI..."
        cargo build --release -p linera-service
    fi
fi

# Verify Linera
echo ""
echo "Step 6: Verifying installation..."
export PATH="$HOME/linera-protocol/target/release:$PATH"
linera --version

# Navigate to project
echo ""
echo "Step 7: Navigating to project..."
cd /mnt/c/Users/shelby/Desktop/Linera-flip-market

echo ""
echo "=== Installation Complete! ==="
echo ""
echo "✓ Rust installed"
echo "✓ wasm32 target added"
echo "✓ Build dependencies installed"
echo "✓ Linera CLI installed"
echo ""
echo "You are now ready to deploy!"
echo ""
echo "Next steps:"
echo "  1. Build WASM: cargo build --release --target wasm32-unknown-unknown"
echo "  2. Deploy: linera project publish-and-create ."
echo "  3. Start service: linera service --port 8080"
echo ""
