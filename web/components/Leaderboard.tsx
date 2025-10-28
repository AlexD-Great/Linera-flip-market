'use client';

import { useEffect } from 'react';
import { useFlipMarketStore } from '@/lib/store';
import { shortenAddress } from '@/lib/utils';
import { Trophy, Loader2 } from 'lucide-react';

export default function Leaderboard() {
  const { leaderboard, fetchLeaderboard, isLoading } = useFlipMarketStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 Top Players</h2>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No players yet. Be the first!</p>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.player}
              className="flex items-center justify-between bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-yellow-400">
                  #{index + 1}
                </span>
                <span className="font-mono text-lg">{shortenAddress(entry.player)}</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">{entry.wins}</p>
                <p className="text-sm text-gray-400">wins</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}