#!/bin/bash
# Linera Flip Market - Testnet Deployment Script
# Run this script in WSL/Ubuntu after setting up the environment

set -e  # Exit on error

echo "🚀 Linera Flip Market - Testnet Conway Deployment"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FAUCET_URL="https://faucet.testnet-conway.linera.net"
WORKSPACE="$HOME/linera-workspace"
WASM_DIR="$WORKSPACE/flip-market-wasm"
CONTRACT_WASM="$WASM_DIR/flip_market_contract.wasm"
SERVICE_WASM="$WASM_DIR/flip_market_service.wasm"

# Set environment variables
export LINERA_WALLET="$HOME/.linera/testnet-wallet.json"
export LINERA_KEYSTORE="$HOME/.linera/testnet-keystore.json"
export LINERA_STORAGE="rocksdb:$HOME/.linera/testnet-client.db"
export LINERA_FAUCET_URL="$FAUCET_URL"

echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check if linera is in PATH
if ! command -v linera &> /dev/null; then
    echo -e "${YELLOW}Warning: 'linera' command not found in PATH${NC}"
    echo "Adding Linera to PATH..."
    export PATH="$WORKSPACE/linera-protocol/target/release:$PATH"
    
    if ! command -v linera &> /dev/null; then
        echo -e "${YELLOW}Error: Linera CLI not found. Please build it first:${NC}"
        echo "  cd $WORKSPACE/linera-protocol"
        echo "  cargo build --release -p linera-service"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Linera CLI found${NC}"

# Check WASM files
echo -e "${BLUE}Step 2: Checking WASM files...${NC}"

if [ ! -f "$CONTRACT_WASM" ]; then
    echo -e "${YELLOW}Error: Contract WASM not found at $CONTRACT_WASM${NC}"
    echo "Please copy your WASM files to $WASM_DIR"
    exit 1
fi

if [ ! -f "$SERVICE_WASM" ]; then
    echo -e "${YELLOW}Error: Service WASM not found at $SERVICE_WASM${NC}"
    echo "Please copy your WASM files to $WASM_DIR"
    exit 1
fi

echo -e "${GREEN}✓ WASM files found${NC}"
echo "  Contract: $(du -h $CONTRACT_WASM | cut -f1)"
echo "  Service:  $(du -h $SERVICE_WASM | cut -f1)"

# Initialize wallet if needed
echo -e "${BLUE}Step 3: Checking wallet...${NC}"

if [ ! -f "$LINERA_WALLET" ]; then
    echo "Initializing wallet with testnet faucet..."
    linera wallet init --faucet $LINERA_FAUCET_URL
    echo -e "${GREEN}✓ Wallet initialized${NC}"
else
    echo -e "${GREEN}✓ Wallet already exists${NC}"
fi

# Request chain if needed
echo -e "${BLUE}Step 4: Checking chain...${NC}"

BALANCE=$(linera query-balance 2>&1 || echo "0")
if [[ "$BALANCE" == *"0"* ]] || [[ "$BALANCE" == *"error"* ]]; then
    echo "Requesting chain from faucet..."
    linera wallet request-chain --faucet $LINERA_FAUCET_URL
    echo -e "${GREEN}✓ Chain requested${NC}"
else
    echo -e "${GREEN}✓ Chain already exists${NC}"
fi

# Show wallet info
echo ""
echo -e "${BLUE}Wallet Information:${NC}"
linera wallet show

# Deploy contract
echo ""
echo -e "${BLUE}Step 5: Deploying contract...${NC}"
echo "This may take a minute..."

cd $WASM_DIR

DEPLOY_OUTPUT=$(linera publish-and-create \
  flip_market_contract.wasm \
  flip_market_service.wasm 2>&1)

echo "$DEPLOY_OUTPUT"

# Extract APPLICATION_ID and CHAIN_ID from output
APPLICATION_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP 'Application ID: \K[a-f0-9]+' || echo "")
CHAIN_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP 'Chain ID: \K[a-f0-9]+' || echo "")

if [ -z "$APPLICATION_ID" ]; then
    # Try alternative parsing
    APPLICATION_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP '[a-f0-9]{64}' | head -1 || echo "")
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT: Save these values!${NC}"
echo ""
echo "APPLICATION_ID: $APPLICATION_ID"
echo "CHAIN_ID: $CHAIN_ID"
echo ""
echo "GraphQL Endpoint:"
echo "http://localhost:8080/chains/$CHAIN_ID/applications/$APPLICATION_ID"
echo ""

# Save to file
DEPLOY_INFO="$HOME/linera-flip-market-deployment.txt"
cat > $DEPLOY_INFO << EOF
Linera Flip Market - Deployment Information
============================================
Deployed: $(date)
Testnet: Conway
Faucet: $FAUCET_URL

APPLICATION_ID: $APPLICATION_ID
CHAIN_ID: $CHAIN_ID

GraphQL Endpoint:
http://localhost:8080/chains/$CHAIN_ID/applications/$APPLICATION_ID

Environment Variables:
LINERA_WALLET=$LINERA_WALLET
LINERA_KEYSTORE=$LINERA_KEYSTORE
LINERA_STORAGE=$LINERA_STORAGE
LINERA_FAUCET_URL=$LINERA_FAUCET_URL

To start the service:
linera service --port 8080

To test:
curl http://localhost:8080/chains/$CHAIN_ID/applications/$APPLICATION_ID
EOF

echo -e "${GREEN}✓ Deployment info saved to: $DEPLOY_INFO${NC}"
echo ""

# Ask if user wants to start service
echo -e "${BLUE}Step 6: Start service?${NC}"
read -p "Do you want to start the Linera service now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}Starting Linera service on port 8080...${NC}"
    echo "Press Ctrl+C to stop"
    echo ""
    linera service --port 8080
else
    echo ""
    echo -e "${YELLOW}To start the service later, run:${NC}"
    echo "  linera service --port 8080"
    echo ""
fi

echo -e "${GREEN}Deployment complete! 🎉${NC}"
