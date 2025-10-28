import { Flip, FlipStatus, CoinSide, LeaderboardEntry } from './types';

// Mock data simulating Linera contract state
let mockFlips: Flip[] = [
  {
    id: 1,
    creator: '0x1234567890abcdef',
    betAmount: '1.0',
    status: FlipStatus.Open,
  },
  {
    id: 2,
    creator: '0xabcdef1234567890',
    betAmount: '0.5',
    player1: {
      address: '0xabcdef1234567890',
      prediction: CoinSide.Heads,
    },
    status: FlipStatus.Waiting,
  },
  {
    id: 3,
    creator: '0x9876543210fedcba',
    betAmount: '2.0',
    player1: {
      address: '0x9876543210fedcba',
      prediction: CoinSide.Tails,
    },
    player2: {
      address: '0x1111222233334444',
      prediction: CoinSide.Heads,
    },
    result: CoinSide.Heads,
    winner: '0x1111222233334444',
    status: FlipStatus.Resolved,
  },
];

let mockLeaderboard: LeaderboardEntry[] = [
  { player: '0x1111222233334444', wins: 5 },
  { player: '0x9876543210fedcba', wins: 3 },
  { player: '0xabcdef1234567890', wins: 2 },
];

let nextFlipId = 4;

// Simulate async API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async getFlips(): Promise<Flip[]> {
    await delay(300);
    return [...mockFlips];
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    await delay(300);
    return [...mockLeaderboard].sort((a, b) => b.wins - a.wins);
  },

  async createFlip(betAmount: string, creator: string): Promise<Flip> {
    await delay(500);
    const newFlip: Flip = {
      id: nextFlipId++,
      creator,
      betAmount,
      status: FlipStatus.Open,
    };
    mockFlips.push(newFlip);
    return newFlip;
  },

  async placeBet(
    flipId: number,
    player: string,
    prediction: CoinSide
  ): Promise<Flip> {
    await delay(500);
    const flip = mockFlips.find(f => f.id === flipId);
    if (!flip) throw new Error('Flip not found');

    if (!flip.player1) {
      flip.player1 = { address: player, prediction };
      flip.status = FlipStatus.Waiting;
    } else if (!flip.player2 && flip.player1.address !== player) {
      flip.player2 = { address: player, prediction };
      
      // Simulate coin flip
      flip.result = Math.random() < 0.5 ? CoinSide.Heads : CoinSide.Tails;
      
      // Determine winner
      if (flip.player1.prediction === flip.result) {
        flip.winner = flip.player1.address;
        updateLeaderboard(flip.player1.address);
      } else {
        flip.winner = flip.player2.address;
        updateLeaderboard(flip.player2.address);
      }
      
      flip.status = FlipStatus.Resolved;
    }

    return flip;
  },
};

function updateLeaderboard(player: string) {
  const entry = mockLeaderboard.find(e => e.player === player);
  if (entry) {
    entry.wins++;
  } else {
    mockLeaderboard.push({ player, wins: 1 });
  }
}
