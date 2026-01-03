# 🎯 Quick Start Guide for Judges

## ⚡ One-Command Setup (Docker Only)

This project uses the **official [Linera Buildathon Template](https://github.com/linera-io/buildathon-template)** for guaranteed reproducibility.

**🎯 RECOMMENDED TESTING METHOD: Docker Compose**

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

**⏱️ Expected Build Time: 20-25 minutes**
- First build compiles all Rust dependencies and Linera SDK from scratch
- This is normal for Rust/WASM projects
- Perfect time for a coffee break ☕

> **Note:** This is the primary and recommended method for evaluating this project. All features are fully functional via Docker.

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

## 🧪 Test Queries (Wave 4 Features)

### Query all flips with bet details
```graphql
query {
  flips {
    id
    creator
    betAmount
    status
    totalBets
    bets {
      player
      prediction
      timestamp
    }
    result
    winner
  }
}
```

### Query active flips only
```graphql
query {
  activeFlips {
    id
    status
    totalBets
  }
}
```

### View enhanced leaderboard
```graphql
query {
  leaderboard {
    player
    wins
    losses
    totalGames
    winRate
    totalWon
  }
}
```

### Create a new flip
```graphql
mutation {
  createFlip(betAmount: "1000000")
}
```

### Place a bet
```graphql
mutation {
  placeBet(flipId: 0, prediction: HEADS)
}
```

## ✅ Verification Checklist

- [ ] Container builds successfully
- [ ] Application deploys to local network
- [ ] GraphQL service is accessible
- [ ] Queries return data
- [ ] Mutations create blocks on-chain

## 🔗 Additional Resources

- **GitHub Repository**: https://github.com/AlexD-Great/Linera-flip-market
- **Wave 4 Features Documentation**: See `WAVE4_FEATURES.md` for detailed feature descriptions
- **Previous Testnet Deployment** (Wave 3): Application ID `1b5f7fcab424e855281b44b1b16a6c2fc608cd5a52e8cbb7d4383d021d754055`

## 💡 Technical Notes

- ✅ **Smart Contract**: Rust-based contract deployed on Linera blockchain
- ✅ **State Management**: Persistent storage using Linera Views (MapView, RegisterView)
- ✅ **GraphQL API**: Service layer exposes blockchain data via GraphQL queries
- ✅ **On-Chain Logic**: All game logic (flip creation, betting, winner determination) runs on-chain
- ✅ **Wave 4 Features**: Multi-bet support, bet history, player statistics, enhanced leaderboard
