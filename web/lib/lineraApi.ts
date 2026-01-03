/**
 * Linera API - Web Client Integration
 * Uses @linera/client library instead of direct GraphQL endpoint
 */

import { Flip, FlipStatus, CoinSide, LeaderboardEntry } from './types';
import { lineraClient } from './lineraClient';

export const lineraApi = {
  /**
   * Get all flips from the blockchain
   */
  async getFlips(): Promise<Flip[]> {
    return await lineraClient.getFlips();
  },

  /**
   * Get leaderboard from the blockchain
   */
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return await lineraClient.getLeaderboard();
  },

  /**
   * Create a new flip
   */
  async createFlip(betAmount: string, creator: string): Promise<Flip> {
    const flipId = await lineraClient.createFlip(betAmount);
    
    // Wait for block to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refetch flips to get the newly created one
    const flips = await this.getFlips();
    const newFlip = flips.find(f => f.id.toString() === flipId);
    
    if (!newFlip) {
      throw new Error('Failed to find newly created flip');
    }
    
    return newFlip;
  },

  /**
   * Place a bet on a flip
   */
  async placeBet(
    flipId: number,
    player: string,
    prediction: CoinSide
  ): Promise<Flip> {
    await lineraClient.placeBet(flipId.toString(), prediction);
    
    // Wait for block to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refetch flips to get the updated one
    const flips = await this.getFlips();
    const updatedFlip = flips.find(f => f.id === flipId);
    
    if (!updatedFlip) {
      throw new Error('Failed to find updated flip');
    }
    
    return updatedFlip;
  },
};
