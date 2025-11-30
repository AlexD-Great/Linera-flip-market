#!/bin/bash
# Step-by-step installation with verification
# Run each section manually to see progress

set -e  # Exit on error

echo "=========================================="
echo "Step 3: Installing Build Dependencies"
echo "=========================================="
echo ""
echo "This will install: gcc, clang, protobuf-compiler, libssl-dev, pkg-config"
echo "You'll need to enter your password for sudo"
echo ""

sudo apt update
sudo apt install -y build-essential pkg-config libssl-dev protobuf-compiler clang

echo ""
echo "✓ Build dependencies installed successfully!"
echo ""
echo "Verifying installations..."
gcc --version | head -n1
clang --version | head -n1
protoc --version

echo ""
echo "=========================================="
echo "Step 4: Cloning Linera Protocol"
echo "=========================================="
echo ""

cd ~
if [ -d "linera-protocol" ]; then
    echo "✓ Linera protocol already exists, skipping clone"
else
    echo "Cloning Linera protocol (testnet_conway branch)..."
    git clone https://github.com/linera-io/linera-protocol.git -b testnet_conway
    echo "✓ Linera protocol cloned successfully!"
fi

echo ""
echo "=========================================="
echo "Step 5: Building Linera CLI"
echo "=========================================="
echo ""
echo "⚠️  WARNING: This step takes 15-30 minutes!"
echo "Please be patient and don't close the terminal."
echo ""
echo "Starting build..."

cd ~/linera-protocol
cargo build --release -p linera-service

echo ""
echo "✓ Linera CLI built successfully!"
echo ""

# Add to PATH
if ! grep -q "linera-protocol/target/release" ~/.bashrc; then
    echo 'export PATH="$HOME/linera-protocol/target/release:$PATH"' >> ~/.bashrc
    echo "✓ Added Linera to PATH in ~/.bashrc"
fi

# Load for current session
export PATH="$HOME/linera-protocol/target/release:$PATH"

echo ""
echo "Verifying Linera installation..."
linera --version

echo ""
echo "=========================================="
echo "✅ ALL PREREQUISITES INSTALLED!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  ✓ Rust 1.91.1"
echo "  ✓ wasm32-unknown-unknown target"
echo "  ✓ Build dependencies (gcc, clang, protobuf, etc.)"
echo "  ✓ Linera CLI"
echo ""
echo "Next steps:"
echo "  1. cd /mnt/c/Users/shelby/Desktop/Linera-flip-market"
echo "  2. cargo build --release --target wasm32-unknown-unknown"
echo "  3. linera project publish-and-create ."
echo ""
