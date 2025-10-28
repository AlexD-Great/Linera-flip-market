'use client';

import { useFlipMarketStore } from '@/lib/store';
import { shortenAddress } from '@/lib/utils';
import { Wallet, LogOut } from 'lucide-react';

export default function WalletConnect() {
  const { currentUser, connectWallet, disconnectWallet } = useFlipMarketStore();

  if (currentUser) {
    return (
      <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        <Wallet className="w-5 h-5 text-green-400" />
        <span className="font-mono text-sm">{shortenAddress(currentUser)}</span>
        <button
          onClick={disconnectWallet}
          className="ml-2 p-1 hover:bg-gray-700 rounded transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4 text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-6 py-2 rounded-lg font-semibold transition-all shadow-lg"
    >
      <Wallet className="w-5 h-5" />
      Connect Wallet
    </button>
  );
}
