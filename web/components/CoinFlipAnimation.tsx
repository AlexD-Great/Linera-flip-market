'use client';

import { useEffect, useState } from 'react';
import { CoinSide } from '@/lib/types';

interface CoinFlipAnimationProps {
  result: CoinSide;
  onComplete: () => void;
}

export default function CoinFlipAnimation({ result, onComplete }: CoinFlipAnimationProps) {
  const [isFlipping, setIsFlipping] = useState(true);

  useEffect(() => {
    // Animation duration
    const timer = setTimeout(() => {
      setIsFlipping(false);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className={`text-9xl mb-8 ${isFlipping ? 'animate-spin' : 'animate-bounce'}`}>
          {result === CoinSide.Heads ? '🪙' : '🎯'}
        </div>
        <h2 className="text-4xl font-bold text-white mb-2">
          {isFlipping ? 'Flipping...' : `${result}!`}
        </h2>
        {!isFlipping && (
          <p className="text-xl text-gray-300 animate-pulse">
            {result === CoinSide.Heads ? 'Heads Wins!' : 'Tails Wins!'}
          </p>
        )}
      </div>
    </div>
  );
}
