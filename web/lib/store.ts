import { create } from 'zustand';
import toast from 'react-hot-toast';
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
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  initWalletListeners: () => void;
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
      toast.error('Please connect wallet first');
      return;
    }

    set({ isLoading: true, error: null });
    const loadingToast = toast.loading('Creating flip...');
    try {
      const newFlip = await mockApi.createFlip(betAmount, currentUser);
      set(state => ({
        flips: [...state.flips, newFlip],
        isLoading: false,
      }));
      toast.success(`Flip #${newFlip.id} created successfully! 🎉`, { id: loadingToast });
    } catch (error) {
      toast.error('Failed to create flip', { id: loadingToast });
      set({ error: 'Failed to create flip', isLoading: false });
    }
  },

  placeBet: async (flipId: number, prediction: CoinSide) => {
    const { currentUser } = get();
    if (!currentUser) {
      toast.error('Please connect wallet first');
      return;
    }

    set({ isLoading: true, error: null });
    const loadingToast = toast.loading(`Betting on ${prediction}...`);
    try {
      const updatedFlip = await mockApi.placeBet(flipId, currentUser, prediction);
      set(state => ({
        flips: state.flips.map(f => f.id === flipId ? updatedFlip : f),
        isLoading: false,
      }));
      
      // Show result
      if (updatedFlip.winner) {
        const isWinner = updatedFlip.winner === currentUser;
        if (isWinner) {
          toast.success(`🎉 You won! Result: ${updatedFlip.result}`, { id: loadingToast, duration: 5000 });
        } else {
          toast.error(`😔 You lost. Result: ${updatedFlip.result}`, { id: loadingToast, duration: 5000 });
        }
      } else {
        toast.success('Bet placed! Waiting for opponent...', { id: loadingToast });
      }
      
      // Refresh leaderboard after bet
      get().fetchLeaderboard();
    } catch (error) {
      toast.error('Failed to place bet', { id: loadingToast });
      set({ error: 'Failed to place bet', isLoading: false });
    }
  },

  connectWallet: async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed! Please install MetaMask to connect your wallet.');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length > 0) {
        set({ currentUser: accounts[0] });
        toast.success('Wallet connected successfully! 🦊');
      }
    } catch (error: any) {
      if (error.code === 4001) {
        // User rejected the connection
        toast.error('Wallet connection rejected');
      } else {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet. Please try again.');
      }
    }
  },

  disconnectWallet: () => {
    set({ currentUser: null });
  },

  initWalletListeners: () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.on) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          set({ currentUser: accounts[0] });
        } else {
          set({ currentUser: null });
        }
      });

      // Listen for chain changes (reload page)
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  },
}));
