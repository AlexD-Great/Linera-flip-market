'use client';

import { useLinera } from './LineraProvider';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function LineraStatus() {
  const { isInitialized, isInitializing, chainId, error, retry } = useLinera();

  if (isInitializing) {
    return (
      <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
        <div>
          <p className="font-semibold text-yellow-400">Connecting to Linera Testnet Conway...</p>
          <p className="text-sm text-gray-300">Initializing wallet and claiming chain from faucet</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <XCircle className="w-5 h-5 text-red-400" />
          <p className="font-semibold text-red-400">Connection Failed</p>
        </div>
        <p className="text-sm text-gray-300 mb-3">{error.message}</p>
        <button
          onClick={retry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  if (isInitialized && chainId) {
    return (
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <p className="font-semibold text-green-400">Connected to Testnet Conway</p>
            <p className="text-sm text-gray-300 font-mono">
              Chain: {chainId.slice(0, 8)}...{chainId.slice(-8)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
