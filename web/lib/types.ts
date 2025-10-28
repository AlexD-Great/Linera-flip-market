// Types matching the Rust smart contract

export enum CoinSide {
  Heads = 'Heads',
  Tails = 'Tails',
}

export enum FlipStatus {
  Open = 'Open',
  Waiting = 'Waiting',
  Full = 'Full',
  Resolved = 'Resolved',
}

export interface Flip {
  id: number;
  creator: string;
  betAmount: string;
  player1?: {
    address: string;
    prediction: CoinSide;
  };
  player2?: {
    address: string;
    prediction: CoinSide;
  };
  result?: CoinSide;
  winner?: string;
  status: FlipStatus;
}

export interface LeaderboardEntry {
  player: string;
  wins: number;
}

export interface FlipMarketState {
  flips: Flip[];
  leaderboard: LeaderboardEntry[];
  currentUser?: string;
}
