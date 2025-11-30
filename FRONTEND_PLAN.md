# 🎨 Frontend Development Plan

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Linera Integration**: Linera Web Client Library
- **Wallet**: CheCko Wallet / Croissant (or custom signer)
- **Deployment**: Vercel

---

## Quick Setup Commands

```bash
# Create Next.js app
npx create-next-app@latest web --typescript --tailwind --app

cd web

# Install Linera dependencies
npm install @linera/web-client

# Install UI dependencies
npm install lucide-react clsx tailwind-merge

# Run dev server
npm run dev
```

---

## File Structure

```
web/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── FlipCard.tsx          # Individual flip display
│   ├── CreateFlip.tsx        # Create flip form
│   ├── PlaceBet.tsx          # Bet placement UI
│   ├── Leaderboard.tsx       # Top players
│   ├── WalletConnect.tsx     # Wallet connection
│   └── Header.tsx            # App header
├── lib/
│   ├── linera.ts             # Linera client setup
│   ├── graphql.ts            # GraphQL queries
│   └── utils.ts              # Helper functions
├── config.ts                 # App configuration
└── package.json
```

---

## Key Components

### 1. Linera Client Setup (`lib/linera.ts`)

```typescript
import { LineraClient } from '@linera/web-client';

export const lineraClient = new LineraClient({
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID!,
  applicationId: process.env.NEXT_PUBLIC_APP_ID!,
  graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
});
```

### 2. GraphQL Queries (`lib/graphql.ts`)

```typescript
export const GET_FLIPS = `
  query GetFlips {
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
`;

export const GET_LEADERBOARD = `
  query GetLeaderboard {
    leaderboard {
      player
      wins
    }
  }
`;

export const CREATE_FLIP = `
  mutation CreateFlip($betAmount: String!) {
    createFlip(betAmount: $betAmount)
  }
`;

export const PLACE_BET = `
  mutation PlaceBet($flipId: Int!, $prediction: CoinSide!) {
    placeBet(flipId: $flipId, prediction: $prediction)
  }
`;
```

### 3. Main Page (`app/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { lineraClient } from '@/lib/linera';
import FlipCard from '@/components/FlipCard';
import CreateFlip from '@/components/CreateFlip';
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
  const [flips, setFlips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlips();
  }, []);

  async function loadFlips() {
    const data = await lineraClient.query(GET_FLIPS);
    setFlips(data.flips);
    setLoading(false);
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">⚡ Linera Flip Market</h1>
      
      <CreateFlip onFlipCreated={loadFlips} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {flips.map(flip => (
          <FlipCard key={flip.id} flip={flip} onBetPlaced={loadFlips} />
        ))}
      </div>
      
      <Leaderboard />
    </main>
  );
}
```

### 4. Flip Card Component (`components/FlipCard.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { lineraClient } from '@/lib/linera';
import { PLACE_BET } from '@/lib/graphql';

export default function FlipCard({ flip, onBetPlaced }) {
  const [prediction, setPrediction] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [loading, setLoading] = useState(false);

  async function handlePlaceBet() {
    setLoading(true);
    try {
      await lineraClient.mutate(PLACE_BET, {
        flipId: flip.id,
        prediction,
      });
      onBetPlaced();
    } catch (error) {
      console.error('Bet failed:', error);
    }
    setLoading(false);
  }

  return (
    <div className="border rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold">Flip #{flip.id}</span>
        <span className="text-xl">💰 {flip.betAmount}</span>
      </div>
      
      {flip.result ? (
        <div className="text-center">
          <div className="text-4xl mb-2">
            {flip.result === 'HEADS' ? '🪙' : '🎯'}
          </div>
          <div className="text-lg font-semibold">
            Result: {flip.result}
          </div>
          <div className="text-green-600">
            Winner: {flip.winner}
          </div>
        </div>
      ) : flip.player1 && !flip.player2 ? (
        <div>
          <p className="mb-4">Waiting for opponent...</p>
          <select 
            value={prediction} 
            onChange={(e) => setPrediction(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="HEADS">🪙 Heads</option>
            <option value="TAILS">🎯 Tails</option>
          </select>
          <button
            onClick={handlePlaceBet}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Placing Bet...' : 'Place Bet'}
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Flip complete</p>
      )}
    </div>
  );
}
```

### 5. Create Flip Component (`components/CreateFlip.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { lineraClient } from '@/lib/linera';
import { CREATE_FLIP } from '@/lib/graphql';

export default function CreateFlip({ onFlipCreated }) {
  const [betAmount, setBetAmount] = useState('1000000');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      await lineraClient.mutate(CREATE_FLIP, { betAmount });
      onFlipCreated();
      setBetAmount('1000000');
    } catch (error) {
      console.error('Create failed:', error);
    }
    setLoading(false);
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Create New Flip</h2>
      <div className="flex gap-4">
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="Bet Amount"
          className="flex-1 p-2 rounded text-black"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-white text-purple-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
        >
          {loading ? 'Creating...' : 'Create Flip'}
        </button>
      </div>
    </div>
  );
}
```

---

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_CHAIN_ID=your_chain_id_here
NEXT_PUBLIC_APP_ID=your_application_id_here
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8080
```

---

## Deployment Steps

### 1. Build Locally

```bash
cd web
npm run build
npm start
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### 3. Update README

Add live demo URL to README.md

---

## Testing Checklist

- [ ] Wallet connection works
- [ ] Can create new flips
- [ ] Can place bets
- [ ] Flips resolve correctly
- [ ] Leaderboard updates
- [ ] Responsive on mobile
- [ ] Error handling works
- [ ] Loading states display

---

## UI/UX Features

### Must Have
- ✅ Create flip form
- ✅ Active flips grid
- ✅ Bet placement
- ✅ Leaderboard
- ✅ Wallet connection

### Nice to Have
- 🎨 Flip animation
- 🔔 Real-time updates
- 📊 Player stats
- 🎯 Bet history
- 🌙 Dark mode

---

## Timeline

**After SDK Fix:**
- Day 1: Setup Next.js + Linera client
- Day 2: Build core components
- Day 3: Styling + polish
- Day 4: Testing + deployment
- Day 5: Submit to buildathon

---

**Status**: 📝 Plan ready, waiting for SDK fix to start development
**Priority**: HIGH - Required for submission
