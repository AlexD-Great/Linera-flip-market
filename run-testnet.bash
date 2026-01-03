#!/usr/bin/env bash

set -eu

echo "🌐 Deploying to Linera Testnet Conway..."

# Initialize wallet for testnet Conway
export LINERA_FAUCET_URL=https://faucet.testnet-conway.linera.net
linera wallet init --faucet="$LINERA_FAUCET_URL"
linera wallet request-chain --faucet="$LINERA_FAUCET_URL"

echo "✅ Wallet initialized and chain created on testnet Conway"

# Build and publish flip-market backend
echo "🚀 Building Flip Market application..."
cd /build
linera project publish-and-create .

echo "✅ Flip Market deployed successfully to testnet Conway!"

# Get the chain ID and application ID
CHAIN_ID=$(linera wallet show | grep "Public Key" -A 1 | tail -n 1 | awk '{print $1}')
APP_ID=$(linera wallet show | grep "Application" | tail -n 1 | awk '{print $2}')

echo "📊 Chain ID: $CHAIN_ID"
echo "🎯 Application ID: $APP_ID"

# Start GraphQL service on port 8081
echo "🚀 Starting GraphQL service..."
linera service --port 8081 &

# Wait for service to start
sleep 5

echo ""
echo "✅ Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Testnet Conway Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 GraphQL Endpoint: http://localhost:8081"
echo "🔗 Chain ID: $CHAIN_ID"
echo "🎯 Application ID: $APP_ID"
echo ""
echo "🔍 Access GraphiQL at:"
echo "   http://localhost:8081/chains/$CHAIN_ID/applications/$APP_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT: This is connected to TESTNET CONWAY"
echo "    All transactions are on the public testnet!"
echo ""

# Keep container alive and show logs
tail -f /dev/null
