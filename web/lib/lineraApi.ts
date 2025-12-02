import { Flip, FlipStatus, CoinSide, LeaderboardEntry } from './types';
import { mockApi } from './mockApi';

// Linera Testnet Conway Configuration
// Use environment variable for Vercel deployment, fallback to localhost for local dev
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 
  'http://localhost:8080/chains/9a58e5e2d5cc82891cd0bfebcc311b309716d357d979a8cb9892b3bfb8f18fc0/applications/1b5f7fcab424e855281b44b1b16a6c2fc608cd5a52e8cbb7d4383d021d754055';

// Check if we're in a browser environment where localhost might not be accessible
const isLocalhost = GRAPHQL_ENDPOINT.includes('localhost');
const isBrowser = typeof window !== 'undefined';

// GraphQL query helper
async function graphqlQuery(query: string, variables?: any) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}

// Convert Linera flip data to frontend format
function convertFlip(lineraFlip: any): Flip {
  const flip: Flip = {
    id: lineraFlip.id,
    creator: lineraFlip.creator,
    betAmount: lineraFlip.betAmount,
    status: lineraFlip.status as FlipStatus,
  };

  if (lineraFlip.player1) {
    flip.player1 = {
      address: lineraFlip.player1,
      prediction: lineraFlip.player1Prediction as CoinSide,
    };
  }

  if (lineraFlip.player2) {
    flip.player2 = {
      address: lineraFlip.player2,
      prediction: lineraFlip.player2Prediction as CoinSide,
    };
  }

  if (lineraFlip.result) {
    flip.result = lineraFlip.result as CoinSide;
  }

  if (lineraFlip.winner) {
    flip.winner = lineraFlip.winner;
  }

  return flip;
}

export const lineraApi = {
  async getFlips(): Promise<Flip[]> {
    try {
      const query = `
        query {
          flips {
            id
            creator
            betAmount
            status
            result
            winner
          }
        }
      `;

      const data = await graphqlQuery(query);
      return data.flips.map(convertFlip);
    } catch (error) {
      // Fallback to mock API if GraphQL fails (e.g., on Vercel without public endpoint)
      console.warn('GraphQL failed, using mock data:', error);
      return mockApi.getFlips();
    }
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const query = `
        query {
          leaderboard {
            player
            wins
          }
        }
      `;

      const data = await graphqlQuery(query);
      return data.leaderboard;
    } catch (error) {
      console.warn('GraphQL failed, using mock data:', error);
      return mockApi.getLeaderboard();
    }
  },

  async createFlip(betAmount: string, creator: string): Promise<Flip> {
    try {
      const mutation = `
        mutation CreateFlip($betAmount: String!) {
          createFlip(betAmount: $betAmount)
        }
      `;

      const data = await graphqlQuery(mutation, { betAmount });
      
      // The mutation returns the operation bytes, we need to refetch flips
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for block
      const flips = await this.getFlips();
      return flips[flips.length - 1]; // Return the newest flip
    } catch (error) {
      console.warn('GraphQL failed, using mock data:', error);
      return mockApi.createFlip(betAmount, creator);
    }
  },

  async placeBet(
    flipId: number,
    player: string,
    prediction: CoinSide
  ): Promise<Flip> {
    try {
      const mutation = `
        mutation PlaceBet($flipId: Int!, $prediction: CoinSide!) {
          placeBet(flipId: $flipId, prediction: $prediction)
        }
      `;

      const predictionEnum = prediction === CoinSide.Heads ? 'HEADS' : 'TAILS';
      await graphqlQuery(mutation, { flipId, prediction: predictionEnum });
      
      // Wait for block and refetch
      await new Promise(resolve => setTimeout(resolve, 1000));
      const flips = await this.getFlips();
      return flips.find(f => f.id === flipId) || flips[0];
    } catch (error) {
      console.warn('GraphQL failed, using mock data:', error);
      return mockApi.placeBet(flipId, player, prediction);
    }
  },
};
