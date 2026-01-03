'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeLineraClient, lineraClient } from '@/lib/lineraClient';
import toast from 'react-hot-toast';

interface LineraContextType {
  isInitialized: boolean;
  isInitializing: boolean;
  chainId: string | null;
  error: Error | null;
  retry: () => void;
}

const LineraContext = createContext<LineraContextType>({
  isInitialized: false,
  isInitializing: false,
  chainId: null,
  error: null,
  retry: () => {},
});

export function useLinera() {
  return useContext(LineraContext);
}

interface LineraProviderProps {
  children: ReactNode;
}

export function LineraProvider({ children }: LineraProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const initialize = async () => {
    if (isInitializing || isInitialized) return;

    setIsInitializing(true);
    setError(null);

    try {
      console.log('🔄 Initializing Linera client...');
      
      await initializeLineraClient();
      
      const id = lineraClient.getChainId();
      setChainId(id);
      setIsInitialized(true);
      
      console.log('✅ Linera client initialized');
      console.log('Chain ID:', id);
      
      toast.success('Connected to Linera Testnet Conway!');

      // Set up notification listener for real-time updates
      lineraClient.onNotification((notification) => {
        console.log('📬 Blockchain notification:', notification);
        if (notification.reason.NewBlock) {
          toast.success('New block created!');
        }
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize Linera client');
      console.error('❌ Linera initialization failed:', error);
      setError(error);
      toast.error(`Failed to connect: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const retry = () => {
    setIsInitialized(false);
    setError(null);
    initialize();
  };

  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      initialize();
    }
  }, []);

  return (
    <LineraContext.Provider
      value={{
        isInitialized,
        isInitializing,
        chainId,
        error,
        retry,
      }}
    >
      {children}
    </LineraContext.Provider>
  );
}
