# 📸 Screenshots Guide for Wave 4 Submission

## 🔗 Quick Access Link

**Click here to open GraphiQL:**
```
http://localhost:8081/chains/d5a223aba479082e5361030d6bb99a63899d2c3417f386e5f7c332a20f8688c7/applications/2a7fbcefff7b8306025ba9609a0870adae4a741c303d5276bd303196aa558c81
```

---

## 📋 QUICK COPY-PASTE QUERIES

Copy each query below, paste in GraphiQL, run, and screenshot!

### Query 1: Create First Flip
```graphql
mutation {
  createFlip(betAmount: "1000000")
}
```

### Query 2: Create Second Flip
```graphql
mutation {
  createFlip(betAmount: "2000000")
}
```

### Query 3: Create Third Flip
```graphql
mutation {
  createFlip(betAmount: "500000")
}
```

### Query 4: Place First Bet (on flip 0)
```graphql
mutation {
  placeBet(flipId: 0, prediction: HEADS)
}
```

### Query 5: Place Second Bet (on flip 0 - completes it)
```graphql
mutation {
  placeBet(flipId: 0, prediction: TAILS)
}
```

### Query 6: Place Bet on Flip 1
```graphql
mutation {
  placeBet(flipId: 1, prediction: HEADS)
}
```

### Query 7: Query All Flips (Wave 4 Features)
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

### Query 8: Active Flips Only
```graphql
query {
  activeFlips {
    id
    status
    totalBets
  }
}
```

### Query 9: Enhanced Leaderboard
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

### Query 10: Player Statistics (replace with your address from Query 7)
```graphql
query {
  playerStats(player: "PASTE_YOUR_ADDRESS_HERE") {
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

### Query 11: Player History (replace with your address from Query 7)
```graphql
query {
  playerHistory(player: "PASTE_YOUR_ADDRESS_HERE") {
    id
    status
    result
    winner
    totalBets
  }
}
```

---

## Required Screenshots for Documentation

### 1. Docker Build Success ✅
**Already captured:** `screenshots/wave4-docker-build-success.png`

**What it shows:**
- Successful compilation
- Application ID
- Chain ID
- GraphQL endpoint
- Build time

---

### 2. GraphiQL Interface
**File:** `screenshots/graphiql-interface.png`

**How to capture:**
1. Open the link above
2. Show the GraphiQL interface with:
   - Query editor on left
   - Results panel on right
   - Schema explorer visible

**Why:** Shows judges the interactive testing environment

---

### 3. Create Flip Mutation
**File:** `screenshots/create-flip-mutation.png`

**Query to use:**
```graphql
mutation {
  createFlip(betAmount: "1000000")
}
```

**What to capture:**
- The mutation in the editor
- Successful response with operation hash
- Clean, readable screenshot

**Why:** Demonstrates mutation functionality

---

### 4. Query All Flips (Wave 4 Features)
**File:** `screenshots/query-flips-wave4.png`

**Query to use:**
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

**What to capture:**
- Full query showing Wave 4 fields (totalBets, bets array)
- Response showing flip data with bet details
- Highlight the new fields

**Why:** Shows multi-bet support and bet tracking

---

### 5. Active Flips Query
**File:** `screenshots/active-flips-query.png`

**Query to use:**
```graphql
query {
  activeFlips {
    id
    status
    totalBets
  }
}
```

**What to capture:**
- Query showing only active flips
- Response with filtered results
- Status showing "Open" or "Active"

**Why:** Demonstrates new active flips dashboard feature

---

### 6. Place Bet Mutation
**File:** `screenshots/place-bet-mutation.png`

**Query to use:**
```graphql
mutation {
  placeBet(flipId: 0, prediction: Heads)
}
```

**What to capture:**
- Mutation with flipId and prediction
- Successful response
- Show it's the second bet (completing the flip)

**Why:** Shows betting functionality

---

### 7. Enhanced Leaderboard
**File:** `screenshots/enhanced-leaderboard.png`

**Query to use:**
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

**What to capture:**
- Full leaderboard query with Wave 4 fields
- Response showing comprehensive stats
- Highlight wins, losses, winRate, totalWon

**Why:** Shows enhanced statistics feature

---

### 8. Player Statistics
**File:** `screenshots/player-stats.png`

**Query to use:**
```graphql
query {
  playerStats(player: "YOUR_PLAYER_ADDRESS") {
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

**What to capture:**
- Query with actual player address
- Detailed stats response
- Show calculated winRate

**Why:** Demonstrates individual player tracking

---

### 9. Player History
**File:** `screenshots/player-history.png`

**Query to use:**
```graphql
query {
  playerHistory(player: "YOUR_PLAYER_ADDRESS") {
    id
    status
    result
    winner
    totalBets
  }
}
```

**What to capture:**
- Query showing player's betting history
- Array of flips the player participated in
- Complete history

**Why:** Shows bet history tracking feature

---

### 10. Complete Flow (Optional)
**File:** `screenshots/complete-flow.png`

**What to show:**
- Side-by-side or sequential screenshots showing:
  1. Create flip
  2. Place first bet (status changes to Active)
  3. Place second bet (status changes to Completed)
  4. Query shows winner
  5. Leaderboard updates

**Why:** Demonstrates full game flow

---

## Screenshot Best Practices

### Quality:
- ✅ High resolution (at least 1920x1080)
- ✅ Clear, readable text
- ✅ No personal information visible
- ✅ Clean browser window (no unnecessary tabs)

### Content:
- ✅ Show both query and response
- ✅ Highlight new Wave 4 features
- ✅ Use consistent formatting
- ✅ Include timestamps if relevant

### Format:
- ✅ PNG format (better quality)
- ✅ Descriptive filenames
- ✅ Organized in `/screenshots` folder

---

## Quick Capture Workflow

1. **Start Docker:**
   ```bash
   docker compose up
   ```

2. **Wait for deployment** (~5 minutes)

3. **Open GraphiQL** in browser

4. **Create test data:**
   - Create 2-3 flips
   - Place bets from different addresses
   - Complete at least one flip

5. **Capture screenshots** following the list above

6. **Verify all screenshots** are clear and show the right data

7. **Update README** to reference screenshots

---

## After Capturing Screenshots

Update `README.md` to include:

```markdown
## 📸 Screenshots

### Docker Deployment Success
![Docker Deployment](screenshots/wave4-docker-build-success.png)
*Successful deployment showing application ID and GraphQL endpoint*

### Wave 4 Features in Action

#### Multi-Bet Support
![Query Flips](screenshots/query-flips-wave4.png)
*Flips showing multiple bets with timestamps*

#### Enhanced Leaderboard
![Leaderboard](screenshots/enhanced-leaderboard.png)
*Leaderboard with wins, losses, win rate, and total winnings*

#### Player Statistics
![Player Stats](screenshots/player-stats.png)
*Comprehensive player statistics tracking*

#### Active Flips Dashboard
![Active Flips](screenshots/active-flips-query.png)
*Filtered view of open and active flips*
```

---

## Priority Order

**Must Have (Critical):**
1. ✅ Docker build success (already have)
2. Query flips with Wave 4 features
3. Enhanced leaderboard
4. Active flips query

**Should Have (Important):**
5. Create flip mutation
6. Place bet mutation
7. Player statistics

**Nice to Have (Bonus):**
8. Player history
9. GraphiQL interface
10. Complete flow

---

**Ready to capture? Start with the "Must Have" screenshots first!** 📸
