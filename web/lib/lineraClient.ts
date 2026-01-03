/**
 * Linera Web Client Integration
 * Following the pattern from: https://linera.dev/developers/frontend/interactivity.html
 */

import { Flip, FlipStatus, CoinSide, LeaderboardEntry } from './types';

// Import Linera client library
// @ts-ignore - Linera client types will be available at runtime
import * as linera from '@linera/client';

// Application ID on Testnet Conway
const FLIP_MARKET_APP_ID = '1e586836ff21783e1336de9838a754e598e33d421b7237a20e04208f9634e68a';
const TESTNET_FAUCET_URL = 'https://faucet.testnet-conway.linera.net';

// Type definitions for Linera client (will be available at runtime via importmap)
declare global {
  interface Window {
    linera: any;
  }
}

class LineraClient {
  private client: any = null;
  private backend: any = null;
  private wallet: any = null;
  private chainId: string | null = null;
  private initialized: boolean = false;
  private notificationCallbacks: Array<(notification: any) => void> = [];

  /**
   * Initialize the Linera client library
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('Linera client can only be initialized in browser environment');
      }

      // Initialize the Linera WebAssembly module
      await linera.default();

      // Connect to testnet faucet and create wallet
      const faucet = await new linera.Faucet(TESTNET_FAUCET_URL);
      this.wallet = await faucet.createWallet();
      this.client = await new linera.Client(this.wallet);

      // Claim a chain from the faucet
      this.chainId = await faucet.claimChain(this.client);

      // Get the application backend
      this.backend = await this.client.frontend().application(FLIP_MARKET_APP_ID);

      // Set up notification listener
      this.client.onNotification((notification: any) => {
        this.notificationCallbacks.forEach(callback => callback(notification));
      });

      this.initialized = true;
      console.log('✅ Linera client initialized successfully');
      console.log('Chain ID:', this.chainId);
    } catch (error) {
      console.error('Failed to initialize Linera client:', error);
      throw error;
    }
  }

  /**
   * Get the current chain ID
   */
  getChainId(): string | null {
    return this.chainId;
  }

  /**
   * Subscribe to blockchain notifications
   */
  onNotification(callback: (notification: any) => void): void {
    this.notificationCallbacks.push(callback);
  }

  /**
   * Execute a GraphQL query against the application
   */
  private async query(graphqlQuery: string): Promise<any> {
    if (!this.initialized || !this.backend) {
      throw new Error('Linera client not initialized. Call initialize() first.');
    }

    try {
      const response = await this.backend.query(
        JSON.stringify({ query: graphqlQuery })
      );
      return JSON.parse(response);
    } catch (error) {
      console.error('GraphQL query failed:', error);
      throw error;
    }
  }

  /**
   * Get all flips
   */
  async getFlips(): Promise<Flip[]> {
    const response = await this.query(`
      query {
        flips {
          id
          creator
          betAmount
          status
          createdAt
          resolvedAt
          winningOutcome
          totalBets
        }
      }
    `);

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    return response.data.flips.map((flip: any) => ({
      id: flip.id,
      creator: flip.creator,
      betAmount: flip.betAmount,
      status: flip.status as FlipStatus,
      createdAt: flip.createdAt,
      resolvedAt: flip.resolvedAt,
      winningOutcome: flip.winningOutcome as CoinSide | null,
      totalBets: flip.totalBets,
    }));
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await this.query(`
      query {
        leaderboard {
          player
          totalWins
          totalLosses
          totalEarnings
          winRate
        }
      }
    `);

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    return response.data.leaderboard;
  }

  /**
   * Create a new flip
   */
  async createFlip(betAmount: string): Promise<string> {
    const response = await this.query(`
      mutation {
        createFlip(betAmount: "${betAmount}")
      }
    `);

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    return response.data.createFlip;
  }

  /**
   * Place a bet on a flip
   */
  async placeBet(flipId: string, prediction: CoinSide): Promise<boolean> {
    const response = await this.query(`
      mutation {
        placeBet(flipId: "${flipId}", prediction: ${prediction})
      }
    `);

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    return response.data.placeBet;
  }
}

// Export singleton instance
export const lineraClient = new LineraClient();

// Export initialization function for use in components
export async function initializeLineraClient(): Promise<void> {
  await lineraClient.initialize();
}

// Export helper to check if client is ready
export function isLineraClientReady(): boolean {
  return lineraClient['initialized'];
}
