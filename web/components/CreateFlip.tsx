'use client';

import { useState } from 'react';
import { useFlipMarketStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export default function CreateFlip() {
  const [betAmount, setBetAmount] = useState('1.0');
  const { createFlip, isLoading, currentUser } = useFlipMarketStore();

  const handleCreate = async () => {
    if (!currentUser) {
      return;
    }
    await createFlip(betAmount);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center">Create New Flip</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">Bet Amount (LINERA)</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            step="0.1"
            min="0.1"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• You create a flip with your bet amount</li>
            <li>• Another player joins and picks Heads or Tails</li>
            <li>• Flip resolves instantly via microchain</li>
            <li>• Winner takes all! 🎉</li>
          </ul>
        </div>

        <button
          onClick={handleCreate}
          disabled={isLoading || !currentUser}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-4 rounded-lg font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            '🚀 Create Flip'
          )}
        </button>
      </div>
    </div>
  );
}