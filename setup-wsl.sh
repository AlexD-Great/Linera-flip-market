#!/bin/bash
# Linera Flip Market - WSL Environment Setup Script
# Run this script first in a fresh WSL/Ubuntu installation

set -e  # Exit on error

echo "🔧 Linera Flip Market - WSL Environment Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

WORKSPACE="$HOME/linera-workspace"

echo -e "${BLUE}Step 1: Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"

echo ""
echo -e "${BLUE}Step 2: Installing build dependencies...${NC}"
sudo apt install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    protobuf-compiler \
    git \
    curl \
    wget
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo -e "${BLUE}Step 3: Installing Rust...${NC}"
if command -v rustc &> /dev/null; then
    echo -e "${GREEN}✓ Rust already installed${NC}"
    rustc --version
else
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo -e "${GREEN}✓ Rust installed${NC}"
fi

# Ensure cargo is in PATH
source $HOME/.cargo/env

echo ""
echo -e "${BLUE}Step 4: Adding WASM target...${NC}"
rustup target add wasm32-unknown-unknown
echo -e "${GREEN}✓ WASM target added${NC}"

echo ""
echo -e "${BLUE}Step 5: Creating workspace...${NC}"
mkdir -p $WORKSPACE
cd $WORKSPACE
echo -e "${GREEN}✓ Workspace created at $WORKSPACE${NC}"

echo ""
echo -e "${BLUE}Step 6: Cloning Linera protocol...${NC}"
if [ -d "$WORKSPACE/linera-protocol" ]; then
    echo -e "${YELLOW}Linera protocol already cloned, updating...${NC}"
    cd $WORKSPACE/linera-protocol
    git fetch
    git checkout testnet_conway
    git pull
else
    git clone https://github.com/linera-io/linera-protocol.git
    cd $WORKSPACE/linera-protocol
    git checkout testnet_conway
fi
echo -e "${GREEN}✓ Linera protocol ready${NC}"

echo ""
echo -e "${BLUE}Step 7: Building Linera CLI...${NC}"
echo "This will take 10-15 minutes. Please be patient..."
cd $WORKSPACE/linera-protocol
cargo build --release -p linera-service
echo -e "${GREEN}✓ Linera CLI built successfully${NC}"

echo ""
echo -e "${BLUE}Step 8: Setting up environment variables...${NC}"

# Add to .bashrc
cat >> $HOME/.bashrc << 'EOF'

# Linera Environment
export PATH="$HOME/linera-workspace/linera-protocol/target/release:$PATH"
export LINERA_WALLET="$HOME/.linera/testnet-wallet.json"
export LINERA_KEYSTORE="$HOME/.linera/testnet-keystore.json"
export LINERA_STORAGE="rocksdb:$HOME/.linera/testnet-client.db"
export LINERA_FAUCET_URL="https://faucet.testnet-conway.linera.net"
EOF

source $HOME/.bashrc
echo -e "${GREEN}✓ Environment variables configured${NC}"

echo ""
echo -e "${BLUE}Step 9: Creating WASM directory...${NC}"
mkdir -p $WORKSPACE/flip-market-wasm
echo -e "${GREEN}✓ WASM directory created${NC}"

echo ""
echo -e "${BLUE}Step 10: Copying WASM files from Windows...${NC}"

WINDOWS_PATH="/mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release"

if [ -f "$WINDOWS_PATH/flip_market_contract.wasm" ]; then
    cp "$WINDOWS_PATH/flip_market_contract.wasm" $WORKSPACE/flip-market-wasm/
    cp "$WINDOWS_PATH/flip_market_service.wasm" $WORKSPACE/flip-market-wasm/
    echo -e "${GREEN}✓ WASM files copied${NC}"
    echo "  Contract: $(du -h $WORKSPACE/flip-market-wasm/flip_market_contract.wasm | cut -f1)"
    echo "  Service:  $(du -h $WORKSPACE/flip-market-wasm/flip_market_service.wasm | cut -f1)"
else
    echo -e "${YELLOW}Warning: WASM files not found at $WINDOWS_PATH${NC}"
    echo "Please copy them manually:"
    echo "  cp /mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/target/wasm32-unknown-unknown/release/*.wasm $WORKSPACE/flip-market-wasm/"
fi

echo ""
echo -e "${BLUE}Step 11: Copying deployment script...${NC}"

DEPLOY_SCRIPT_PATH="/mnt/c/Users/SADAM/OneDrive/Adam/OneDrive/Desktop/Linera-flip-market/deploy.sh"

if [ -f "$DEPLOY_SCRIPT_PATH" ]; then
    cp "$DEPLOY_SCRIPT_PATH" $WORKSPACE/flip-market-wasm/
    chmod +x $WORKSPACE/flip-market-wasm/deploy.sh
    echo -e "${GREEN}✓ Deployment script copied${NC}"
else
    echo -e "${YELLOW}Warning: Deployment script not found${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Reload your shell environment:"
echo "   ${BLUE}source ~/.bashrc${NC}"
echo ""
echo "2. Verify installation:"
echo "   ${BLUE}linera --version${NC}"
echo "   ${BLUE}rustc --version${NC}"
echo "   ${BLUE}protoc --version${NC}"
echo ""
echo "3. Deploy your contract:"
echo "   ${BLUE}cd $WORKSPACE/flip-market-wasm${NC}"
echo "   ${BLUE}./deploy.sh${NC}"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
