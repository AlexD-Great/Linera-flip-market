# 🚀 Deployment Guide

## Prerequisites

- ✅ Linera CLI v0.15.6 (testnet_conway)
- ✅ Rust 1.70+
- ✅ WASM target: `rustup target add wasm32-unknown-unknown`
- ⏳ SDK atomics bug fix (pending)

---

## Option 1: Deploy to Testnet Conway (PREFERRED)

### Step 1: Initialize Wallet

```bash
linera wallet init --faucet https://faucet.testnet-conway.linera.net
```

### Step 2: Verify Wallet

```bash
linera wallet show
```

You should see a chain with an owner key.

### Step 3: Deploy Application

```bash
cd /path/to/Linera-flip-market
linera project publish-and-create .
```

### Step 4: Note Application ID

Save the Application ID from the output:
```
Application ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000001000000
```

### Step 5: Start GraphQL Service

```bash
linera service --port 8080
```

Access GraphQL playground at: `http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID>`

---

## Option 2: Deploy to Local Network

### Step 1: Start Local Network

```bash
cd /path/to/Linera-flip-market
linera net up --testing-prng-seed 37
```

**Keep this terminal running!**

### Step 2: Set Environment Variables

Open a **new terminal** and copy the export commands from the first terminal:

```bash
export LINERA_WALLET="/tmp/.tmpXXXXXX/wallet_0.json"
export LINERA_KEYSTORE="/tmp/.tmpXXXXXX/keystore_0.json"
export LINERA_STORAGE="rocksdb:/tmp/.tmpXXXXXX/client_0.db"
```

### Step 3: Deploy Application

```bash
cd /path/to/Linera-flip-market
linera project publish-and-create .
```

### Step 4: Start GraphQL Service

```bash
linera service --port 8080
```

---

## Frontend Integration

### Get Application Details

After deployment, note:
- **Chain ID**: From wallet or deployment output
- **Application ID**: From deployment output
- **GraphQL Endpoint**: `http://localhost:8080` (local) or testnet endpoint

### Update Frontend Config

```typescript
// web/config.ts
export const LINERA_CONFIG = {
  chainId: 'YOUR_CHAIN_ID',
  applicationId: 'YOUR_APPLICATION_ID',
  graphqlEndpoint: 'http://localhost:8080',
};
```

### Deploy Frontend

```bash
cd web
npm install
npm run build

# Deploy to Vercel
vercel --prod
```

---

## Testing Deployment

### Test GraphQL Queries

```graphql
# Get all flips
query {
  flips {
    id
    creator
    betAmount
    player1
    player2
    result
    winner
  }
}

# Get leaderboard
query {
  leaderboard {
    player
    wins
  }
}
```

### Test Mutations

```graphql
# Create a flip
mutation {
  createFlip(betAmount: "1000000") {
    success
  }
}

# Place a bet
mutation {
  placeBet(flipId: 0, prediction: HEADS) {
    success
  }
}
```

---

## Troubleshooting

### Issue: "No chain specified in wallet"

**Solution**: Set default chain
```bash
linera wallet set-default <CHAIN_ID>
```

### Issue: "Client is not configured to propose"

**Solution**: Assign owner key
```bash
linera keygen
linera assign --owner <PUBLIC_KEY> --chain-id <CHAIN_ID>
```

### Issue: "Unknown opcode 252"

**Status**: Known SDK bug in testnet_conway
**Solution**: Wait for Linera team fix

### Issue: "Blobs not found"

**Cause**: Normal warning during blob propagation
**Solution**: Ignore - deployment continues successfully

---

## Docker Deployment (Alternative)

If using the buildathon Docker template:

```bash
# Build Docker image
docker build -t linera-flip-market .

# Run container
docker run -p 8080:8080 linera-flip-market
```

---

## Production Checklist

- [ ] Application deployed to Testnet Conway
- [ ] GraphQL service running and accessible
- [ ] Frontend deployed and connected
- [ ] All operations tested (create flip, place bet)
- [ ] Leaderboard updating correctly
- [ ] Application ID documented
- [ ] Chain ID documented
- [ ] Live demo URL added to README

---

## Submission URLs

After deployment, update:

1. **README.md**: Add live demo URL
2. **SUBMISSION_CHECKLIST.md**: Mark deployment complete
3. **Buildathon form**: Submit with live demo link

---

**Status**: ⏳ Ready for deployment pending SDK fix
**Last Updated**: November 30, 2025
