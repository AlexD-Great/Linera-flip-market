# ⚡ QUICK SCREENSHOT WORKFLOW

## 🔗 Step 1: Open GraphiQL

**Click this link:**
```
http://localhost:8081/chains/d5a223aba479082e5361030d6bb99a63899d2c3417f386e5f7c332a20f8688c7/applications/2a7fbcefff7b8306025ba9609a0870adae4a741c303d5276bd303196aa558c81
```

---

## 📸 Step 2: Copy, Paste, Run, Screenshot!

### Screenshot 1: GraphiQL Interface
- Just capture the interface as-is
- File: `screenshots/graphiql-interface.png`

---

### Screenshot 2: Create Flip #1
```graphql
mutation {
  createFlip(betAmount: "1000000")
}
```
- File: `screenshots/create-flip-mutation.png`

---

### Screenshot 3: Create Flip #2
```graphql
mutation {
  createFlip(betAmount: "2000000")
}
```

---

### Screenshot 4: Create Flip #3
```graphql
mutation {
  createFlip(betAmount: "500000")
}
```

---

### Screenshot 5: Place First Bet
```graphql
mutation {
  placeBet(flipId: 0, prediction: HEADS)
}
```
- File: `screenshots/place-bet-mutation.png`

---

### Screenshot 6: Place Second Bet (completes flip 0)
```graphql
mutation {
  placeBet(flipId: 0, prediction: TAILS)
}
```

---

### Screenshot 7: Place Bet on Flip 1
```graphql
mutation {
  placeBet(flipId: 1, prediction: HEADS)
}
```

---

### Screenshot 8: Query All Flips ⭐ CRITICAL
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
- File: `screenshots/query-flips-wave4.png`
- **IMPORTANT:** Copy the creator address from the response!

---

### Screenshot 9: Active Flips ⭐ CRITICAL
```graphql
query {
  activeFlips {
    id
    status
    totalBets
  }
}
```
- File: `screenshots/active-flips-query.png`

---

### Screenshot 10: Enhanced Leaderboard ⭐ CRITICAL
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
- File: `screenshots/enhanced-leaderboard.png`

---

### Screenshot 11: Player Statistics
```graphql
query {
  playerStats(player: "PASTE_CREATOR_ADDRESS_FROM_SCREENSHOT_8") {
    player
    totalGames
    wins
    losses
    winRate
    totalWagered
    totalWon
  }
}
```
- Replace `PASTE_CREATOR_ADDRESS_FROM_SCREENSHOT_8` with actual address
- File: `screenshots/player-stats.png`

---

### Screenshot 12: Player History
```graphql
query {
  playerHistory(player: "PASTE_CREATOR_ADDRESS_FROM_SCREENSHOT_8") {
    id
    status
    result
    winner
    totalBets
  }
}
```
- Replace `PASTE_CREATOR_ADDRESS_FROM_SCREENSHOT_8` with actual address
- File: `screenshots/player-history.png`

---

## ✅ Done!

You should now have:
- 12 screenshots total
- All saved in `/screenshots` folder
- All showing Wave 4 features

**Next:** Update README.md with screenshot references!
