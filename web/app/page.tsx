'use client';

import { useState } from 'react';
import FlipCard from '@/components/FlipCard';
import CreateFlip from '@/components/CreateFlip';
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('flips');

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            ⚡ Linera Flip Market
          </h1>
          <p className="text-xl text-gray-300">
            Real-time coin flip betting powered by microchains
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('flips')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'flips'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            🎲 Active Flips
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            ➕ Create Flip
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            🏆 Leaderboard
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'flips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FlipCard
                id={1}
                creator="0x1234...5678"
                betAmount="1.0"
                status="Open"
              />
              <FlipCard
                id={2}
                creator="0xabcd...efgh"
                betAmount="0.5"
                status="Waiting"
              />
            </div>
          )}
          {activeTab === 'create' && <CreateFlip />}
          {activeTab === 'leaderboard' && <Leaderboard />}
        </div>
      </div>
    </main>
  );
}