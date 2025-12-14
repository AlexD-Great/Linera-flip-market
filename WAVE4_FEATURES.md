# 🚀 Wave 4 Features - Linera Flip Market

## Overview

Wave 4 introduces major enhancements to the Flip Market application, focusing on improved user experience, comprehensive statistics, and multi-player support.

## ✨ New Features

### 1. Multi-Bet Support

**What it does:** Multiple players can now place bets on the same flip, not just two players.

**How it works:**
- Flip starts in "Open" status when created
- First bet changes status to "Active"
- Second bet triggers completion and determines winner
- All participants tracked with individual bet records

**Benefits:**
- More flexible betting system
- Better tracking of all participants
- Timestamps for each bet

**GraphQL Example:**
```graphql
{
  flips {
    id
    status
    totalBets
    bets {
      player
      prediction
      timestamp
    }
  }
}
```

---

### 2. Bet History Tracking

**What it does:** Every player's participation in flips is tracked and queryable.

**How it works:**
- System maintains a history of all flip IDs a player participated in
- Query any player's complete betting history
- See all past flips with outcomes

**Benefits:**
- Players can review their betting history
- Audit trail for all bets
- Easy to track performance over time

**GraphQL Example:**
```graphql
{
  playerHistory(player: "e476...") {
    id
    betAmount
    status
    result
    winner
    bets {
      player
      prediction
    }
  }
}
```

---

### 3. Comprehensive Player Statistics

**What it does:** Detailed statistics for each player including wins, losses, win rate, and financial totals.

**Tracked Metrics:**
- Total games played
- Number of wins
- Number of losses
- Win rate percentage
- Total amount wagered
- Total amount won

**Benefits:**
- Players can see their performance
- Leaderboard becomes more meaningful
- Better insights into betting patterns

**GraphQL Example:**
```graphql
{
  playerStats(player: "e476...") {
    totalGames
    wins
    losses
    winRate
    totalWagered
    totalWon
  }
}
```

---

### 4. Enhanced Leaderboard

**What it does:** Leaderboard now shows comprehensive statistics, not just win count.

**New Fields:**
- Wins and losses
- Total games played
- Win rate percentage
- Total winnings

**Sorting:**
- Primary: By number of wins (descending)
- Secondary: By win rate (descending)

**Benefits:**
- More competitive and informative
- Shows player skill, not just activity
- Fair ranking system

**GraphQL Example:**
```graphql
{
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

---

### 5. Active Flips Dashboard

**What it does:** Query to get only open or active flips (excludes completed ones).

**Use Cases:**
- Find flips available to join
- See ongoing games
- Filter out historical data

**Benefits:**
- Easier to find games to join
- Cleaner UI for active games
- Better user experience

**GraphQL Example:**
```graphql
{
  activeFlips {
    id
    creator
    betAmount
    status
    totalBets
  }
}
```

---

## 🎯 Complete GraphQL API Reference

### Queries

#### 1. Get All Flips
```graphql
{
  flips {
    id
    creator
    betAmount
    status          # "Open", "Active", or "Completed"
    totalBets
    bets {
      player
      prediction   # "Heads" or "Tails"
      timestamp
    }
    result         # Final coin flip result
    winner         # Winning player address
  }
}
```

#### 2. Get Active Flips Only
```graphql
{
  activeFlips {
    id
    creator
    betAmount
    status
    totalBets
    bets {
      player
      prediction
    }
  }
}
```

#### 3. Get Player History
```graphql
{
  playerHistory(player: "YOUR_ADDRESS_HERE") {
    id
    creator
    betAmount
    status
    result
    winner
    totalBets
    bets {
      player
      prediction
      timestamp
    }
  }
}
```

#### 4. Get Player Statistics
```graphql
{
  playerStats(player: "YOUR_ADDRESS_HERE") {
    player
    totalGames
    wins
    losses
    winRate        # Percentage (0-100)
    totalWagered
    totalWon
  }
}
```

#### 5. Get Enhanced Leaderboard
```graphql
{
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

### Mutations

#### 1. Create a Flip
```graphql
mutation {
  createFlip(betAmount: "1000000")
}
```

#### 2. Place a Bet
```graphql
mutation {
  placeBet(flipId: 0, prediction: Heads)
}
```

---

## 🔧 Technical Implementation

### State Structure Changes

**New Types:**
- `Bet` - Individual bet record with player, prediction, timestamp
- `FlipStatus` - Enum: Open, Active, Completed
- `PlayerStats` - Comprehensive player statistics

**Enhanced Flip:**
- Now contains `Vec<Bet>` instead of just two players
- Includes status tracking
- Timestamps for creation and completion

**New State Maps:**
- `player_stats: MapView<String, PlayerStats>` - Player statistics
- `player_history: MapView<String, Vec<u64>>` - Bet history per player

### Contract Logic Updates

**Multi-Bet Flow:**
1. Create flip → Status: Open
2. First bet → Status: Active
3. Second bet → Status: Completed, result determined
4. All participants get stats updated

**Statistics Tracking:**
- Automatic update on flip completion
- Tracks wins, losses, amounts
- Maintains bet history

---

## 📊 Example Usage Scenarios

### Scenario 1: New Player Joins
```graphql
# 1. Check active flips
{ activeFlips { id betAmount totalBets } }

# 2. Place bet on flip #0
mutation { placeBet(flipId: 0, prediction: Heads) }

# 3. Check your stats
{ playerStats(player: "YOUR_ADDRESS") { wins losses winRate } }
```

### Scenario 2: Check Performance
```graphql
# 1. Get your complete history
{ playerHistory(player: "YOUR_ADDRESS") { 
    id result winner 
  } 
}

# 2. Get detailed stats
{ playerStats(player: "YOUR_ADDRESS") {
    totalGames
    wins
    losses
    winRate
    totalWagered
    totalWon
  }
}
```

### Scenario 3: View Leaderboard
```graphql
# Get top players with full stats
{ 
  leaderboard {
    player
    wins
    losses
    winRate
    totalWon
  }
}
```

---

## 🎓 Key Improvements Over Wave 3

| Feature | Wave 3 | Wave 4 |
|---------|--------|--------|
| **Bets per Flip** | 2 players only | Multiple players |
| **Player Stats** | Win count only | Full statistics |
| **Leaderboard** | Wins only | Wins, losses, rate, totals |
| **History** | Not tracked | Complete history |
| **Status Tracking** | Basic | Open/Active/Completed |
| **Timestamps** | Not tracked | All bets timestamped |

---

## 🚀 Future Enhancements

Potential additions for future waves:
- Bet expiry (time-based)
- Bet cancellation (if unopposed)
- Achievements system
- Social features (challenges)
- Analytics dashboard
- Multi-chain support

---

## 📝 Notes

- All amounts are in microunits (1 token = 1,000,000 microunits)
- Timestamps are in microseconds since Unix epoch
- Win rate is calculated as: (wins / total_games) * 100
- Leaderboard is sorted by wins first, then win rate
- Player addresses are Linera account addresses

---

**Wave 4 Status:** ✅ Complete and Deployed
**Build Time:** 4 minutes 46 seconds
**Application ID:** `2a7fbcefff7b8306025ba9609a0870adae4a741c303d5276bd303196aa558c81`
**Chain ID:** `d5a223aba479082e5361030d6bb99a63899d2c3417f386e5f7c332a20f8688c7`
