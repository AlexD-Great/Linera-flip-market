'use client';

import { useState, useEffect } from 'react';
import FlipCard from '@/components/FlipCard';
import CreateFlip from '@/components/CreateFlip';
import Leaderboard from '@/components/Leaderboard';
import WalletConnect from '@/components/WalletConnect';
import Footer from '@/components/Footer';
import { useFlipMarketStore } from '@/lib/store';
import { Loader2, Coins, PlusCircle, Trophy } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('flips');
  const { flips, fetchFlips, isLoading, initWalletListeners } = useFlipMarketStore();

  useEffect(() => {
    fetchFlips();
    initWalletListeners();
  }, [fetchFlips, initWalletListeners]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            ⚡ Linera Flip Market
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Real-time coin flip betting powered by microchains
          </p>
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        </header>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('flips')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'flips'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <Coins className="w-5 h-5" />
            Active Flips
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            Create Flip
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Leaderboard
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'flips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                </div>
              ) : flips.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No active flips yet. Create one to get started!</p>
                </div>
              ) : (
                flips.map((flip) => (
                  <FlipCard key={flip.id} flip={flip} />
                ))
              )}
            </div>
          )}
          {activeTab === 'create' && <CreateFlip />}
          {activeTab === 'leaderboard' && <Leaderboard />}
        </div>
      </div>
      <Footer />
    </main>
  );
}