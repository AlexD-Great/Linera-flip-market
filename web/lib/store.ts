import { create } from 'zustand';
import { Flip, LeaderboardEntry, CoinSide } from './types';
import { mockApi } from './mockApi';

interface FlipMarketStore {
  flips: Flip[];
  leaderboard: LeaderboardEntry[];
  currentUser: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchFlips: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  createFlip: (betAmount: string) => Promise<void>;
  placeBet: (flipId: number, prediction: CoinSide) => Promise<void>;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export const useFlipMarketStore = create<FlipMarketStore>((set, get) => ({
  flips: [],
  leaderboard: [],
  currentUser: null,
  isLoading: false,
  error: null,

  fetchFlips: async () => {
    set({ isLoading: true, error: null });
    try {
      const flips = await mockApi.getFlips();
      set({ flips, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch flips', isLoading: false });
    }
  },

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const leaderboard = await mockApi.getLeaderboard();
      set({ leaderboard, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch leaderboard', isLoading: false });
    }
  },

  createFlip: async (betAmount: string) => {
    const { currentUser } = get();
    if (!currentUser) {
      set({ error: 'Please connect wallet first' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const newFlip = await mockApi.createFlip(betAmount, currentUser);
      set(state => ({
        flips: [...state.flips, newFlip],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create flip', isLoading: false });
    }
  },

  placeBet: async (flipId: number, prediction: CoinSide) => {
    const { currentUser } = get();
    if (!currentUser) {
      set({ error: 'Please connect wallet first' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const updatedFlip = await mockApi.placeBet(flipId, currentUser, prediction);
      set(state => ({
        flips: state.flips.map(f => f.id === flipId ? updatedFlip : f),
        isLoading: false,
      }));
      
      // Refresh leaderboard after bet
      get().fetchLeaderboard();
    } catch (error) {
      set({ error: 'Failed to place bet', isLoading: false });
    }
  },

  connectWallet: () => {
    // Simulate wallet connection - generate random address
    const randomAddress = '0x' + Math.random().toString(16).substring(2, 18);
    set({ currentUser: randomAddress });
  },

  disconnectWallet: () => {
    set({ currentUser: null });
  },
}));
