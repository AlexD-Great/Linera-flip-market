'use client';

import { useFlipMarketStore } from '@/lib/store';
import { shortenAddress } from '@/lib/utils';
import { CoinSide, Flip } from '@/lib/types';
import { Loader2, CircleDollarSign, Target } from 'lucide-react';

interface FlipCardProps {
  flip: Flip;
}

export default function FlipCard({ flip }: FlipCardProps) {
  const { placeBet, isLoading, currentUser } = useFlipMarketStore();

  const handleBet = async (prediction: CoinSide) => {
    if (!currentUser) {
      return;
    }
    await placeBet(flip.id, prediction);
  };

  const canBet = flip.status === 'Open' || (flip.status === 'Waiting' && flip.player1?.address !== currentUser);
  const isResolved = flip.status === 'Resolved';

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 hover:border-purple-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold">Flip #{flip.id}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            flip.status === 'Open'
              ? 'bg-green-500'
              : flip.status === 'Waiting'
              ? 'bg-yellow-500'
              : 'bg-gray-500'
          }`}
        >
          {flip.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-400">
          Creator: <span className="text-white font-mono">{shortenAddress(flip.creator)}</span>
        </p>
        <p className="text-gray-400">
          Bet Amount:{' '}
          <span className="text-yellow-400 font-bold">{flip.betAmount} LINERA</span>
        </p>
      </div>

      {isResolved && flip.result && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-xl font-bold mb-2">
            {flip.result === CoinSide.Heads ? (
              <>
                <CircleDollarSign className="w-6 h-6 text-yellow-400" />
                <span>Heads</span>
              </>
            ) : (
              <>
                <Target className="w-6 h-6 text-red-400" />
                <span>Tails</span>
              </>
            )}
          </div>
          {flip.winner && (
            <p className="text-center text-green-400 mt-2">
              Winner: {shortenAddress(flip.winner)}
            </p>
          )}
        </div>
      )}

      {canBet && (
        <div className="flex gap-2">
          <button 
            onClick={() => handleBet(CoinSide.Heads)}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CircleDollarSign className="w-5 h-5" />
                <span>Bet Heads</span>
              </>
            )}
          </button>
          <button 
            onClick={() => handleBet(CoinSide.Tails)}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Target className="w-5 h-5" />
                <span>Bet Tails</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}