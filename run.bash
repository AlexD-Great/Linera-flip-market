#!/usr/bin/env bash

set -eu

eval "$(linera net helper)"
linera_spawn linera net up --with-faucet

export LINERA_FAUCET_URL=http://localhost:8080
linera wallet init --faucet="$LINERA_FAUCET_URL"
linera wallet request-chain --faucet="$LINERA_FAUCET_URL"

# Build and publish flip-market backend
echo "🚀 Building Flip Market application..."
cd /build
linera project publish-and-create .

echo "✅ Flip Market deployed successfully!"
echo "📊 GraphQL endpoint: http://localhost:8081"

# Start GraphQL service on port 8081 (9001 is used by validator)
linera service --port 8081 &

# Keep container alive and show logs
echo "🎯 Application is running!"
echo "Access GraphQL at: http://localhost:8081"
tail -f /dev/null
