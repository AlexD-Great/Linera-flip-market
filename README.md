# 🎲 Linera Flip Market - Buildathon Submission

A decentralized coin flip betting game built on Linera Protocol. Players can create flip bets, join existing flips, and compete on a global leaderboard.

## 🎯 Project Description

Flip Market is a fully on-chain betting application where users can:
- Create coin flip bets with custom amounts
- Join existing flips and predict the outcome (Heads/Tails)
- View real-time leaderboard of top players
- All game logic runs on Linera smart contracts with provably fair randomness

## 🔗 Links

- **GitHub Repository**: https://github.com/AlexD-Great/Linera-flip-market
- **Frontend Demo**: https://linera-flip-market.vercel.app/
- **Linera SDK Version**: v0.15.5

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose

### Run Locally

1. **Clone the repository**:
```bash
git clone https://github.com/AlexD-Great/Linera-flip-market.git
cd Linera-flip-market
```

2. **Start the application**:
```bash
docker compose up
```

3. **Access the GraphQL API**:
   - The application will deploy automatically
   - Check the logs for your Chain ID and Application ID
   - Access GraphiQL at: `http://localhost:8081/chains/{CHAIN_ID}/applications/{APP_ID}`

### Example GraphQL Queries

**Query all flips**:
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

**Create a new flip**:
```graphql
mutation {
  createFlip(betAmount: "1000000")
}
```

**Place a bet**:
```graphql
mutation {
  placeBet(flipId: 0, prediction: HEADS)
}
```

## 📦 Structure

- **Port 8080**: Linera faucet
- **Port 8081**: GraphQL service for the application
- **Port 9001**: Localnet validator's gRPC server
- **Port 13001**: Localnet validator proxy

## 🛠️ Linera Features Used

- **Linera SDK v0.15.5**: Core smart contract framework
- **Linera Views**: Persistent state management (MapView for flips and leaderboard)
- **GraphQL Service**: Query and mutation API for the application
- **Linera Operations**: CreateFlip and PlaceBet operations
- **Cross-chain messaging**: Ready for multi-chain deployment

## 👥 Team

- **Name**: Alex D Great
- **Discord**: @alexdgreat
- **Wallet**: TBD

## 📝 Changelog

### Wave 1 Submission
- ✅ Implemented core flip creation and betting logic
- ✅ Added leaderboard tracking system
- ✅ GraphQL API with queries and mutations
- ✅ Dockerized deployment using buildathon template
- ✅ Local network testing complete
