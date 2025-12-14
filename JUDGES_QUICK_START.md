# 🎯 Quick Start Guide for Judges

## ⚡ One-Command Setup

This project uses the **official [Linera Buildathon Template](https://github.com/linera-io/buildathon-template)**.

### Requirements
- Docker Desktop or Docker Engine
- Docker Compose

### Run the Application

```bash
git clone https://github.com/AlexD-Great/Linera-flip-market.git
cd Linera-flip-market
docker compose up
```

**That's it!** No manual setup required.

## 📊 What Happens

The Docker container will automatically:
1. ✅ Install Rust and WASM target
2. ✅ Install Linera CLI tools (v0.15.5)
3. ✅ Start a local Linera network with faucet
4. ✅ Build the Flip Market contract
5. ✅ Deploy to the local network
6. ✅ Start GraphQL service on port 8081

## 🎮 Access the Application

Watch the Docker logs for output like:
```
🚀 Building Flip Market application...
✅ Flip Market deployed successfully!
📊 GraphQL endpoint: http://localhost:8081
```

The logs will show your **Chain ID** and **Application ID**.

Access GraphiQL at:
```
http://localhost:8081/chains/{CHAIN_ID}/applications/{APP_ID}
```

## 🧪 Test Queries

### Query all flips
```graphql
{
  flips {
    id
    creator
    betAmount
    status
    result
    winner
  }
}
```

### Create a new flip
```graphql
mutation {
  createFlip(betAmount: "1000000")
}
```

### View leaderboard
```graphql
{
  leaderboard {
    player
    wins
  }
}
```

## ✅ Verification Checklist

- [ ] Container builds successfully
- [ ] Application deploys to local network
- [ ] GraphQL service is accessible
- [ ] Queries return data
- [ ] Mutations create blocks on-chain

## 🔗 Additional Resources

- **GitHub**: https://github.com/AlexD-Great/Linera-flip-market
- **Testnet Deployment**: Application ID `1b5f7fcab424e855281b44b1b16a6c2fc608cd5a52e8cbb7d4383d021d754055`
- **Frontend Demo**: https://linera-flip-market.vercel.app/

## 💡 Notes

- The application communicates with the Linera network via GraphQL
- All game logic runs on-chain in the smart contract
- Leaderboard and flip state are persisted using Linera Views
- Random number generation uses on-chain randomness for fairness
