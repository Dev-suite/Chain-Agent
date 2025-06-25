import { useState, useEffect, createContext, useContext } from 'react';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  isConnecting: boolean;
  error: string | null;
}

export interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (txn: any) => Promise<any>;
}

// Algorand wallet types
declare global {
  interface Window {
    algorand?: {
      enable: () => Promise<{ accounts: string[] }>;
      signTransaction: (txn: any) => Promise<any>;
      isConnected: () => boolean;
      disconnect: () => void;
    };
    AlgoSigner?: {
      connect: () => Promise<void>;
      accounts: (params: { ledger: string }) => Promise<Array<{ address: string }>>;
      algod: (params: { ledger: string; path: string }) => Promise<any>;
      sign: (txn: any) => Promise<any>;
    };
    PeraWallet?: {
      connect: () => Promise<string[]>;
      disconnect: () => void;
      signTransaction: (txnGroup: any[], signerAddress?: string) => Promise<any>;
      isConnected: () => boolean;
    };
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    isConnecting: false,
    error: null,
  });

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      const savedAddress = localStorage.getItem('wallet_address');
      const savedWalletType = localStorage.getItem('wallet_type');
      
      if (savedAddress && savedWalletType) {
        // Verify the connection is still valid
        const isStillConnected = await verifyConnection(savedWalletType);
        if (isStillConnected) {
          const balance = await fetchBalance(savedAddress);
          setWalletState({
            isConnected: true,
            address: savedAddress,
            balance,
            isConnecting: false,
            error: null,
          });
        } else {
          // Clear invalid connection
          localStorage.removeItem('wallet_address');
          localStorage.removeItem('wallet_type');
        }
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const verifyConnection = async (walletType: string): Promise<boolean> => {
    try {
      switch (walletType) {
        case 'pera':
          return window.PeraWallet?.isConnected() || false;
        case 'algorand':
          return window.algorand?.isConnected() || false;
        case 'algosigner':
          // AlgoSigner doesn't have a direct isConnected method
          return true;
        default:
          return false;
      }
    } catch {
      return false;
    }
  };

  const fetchBalance = async (address: string): Promise<number> => {
    try {
      // In a real implementation, you'd call the Algorand API
      // For now, we'll simulate with a random balance
      const response = await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${address}`);
      if (response.ok) {
        const data = await response.json();
        return data.amount / 1000000; // Convert microAlgos to Algos
      }
      return 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };

  const connectPeraWallet = async (): Promise<string> => {
    if (!window.PeraWallet) {
      throw new Error('Pera Wallet not found. Please install Pera Wallet extension.');
    }

    try {
      const accounts = await window.PeraWallet.connect();
      if (accounts && accounts.length > 0) {
        return accounts[0];
      }
      throw new Error('No accounts found');
    } catch (error: any) {
      throw new Error(`Pera Wallet connection failed: ${error.message}`);
    }
  };

  const connectAlgorandWallet = async (): Promise<string> => {
    if (!window.algorand) {
      throw new Error('Algorand Wallet not found. Please install an Algorand-compatible wallet.');
    }

    try {
      const result = await window.algorand.enable();
      if (result.accounts && result.accounts.length > 0) {
        return result.accounts[0];
      }
      throw new Error('No accounts found');
    } catch (error: any) {
      throw new Error(`Algorand Wallet connection failed: ${error.message}`);
    }
  };

  const connectAlgoSigner = async (): Promise<string> => {
    if (!window.AlgoSigner) {
      throw new Error('AlgoSigner not found. Please install AlgoSigner extension.');
    }

    try {
      await window.AlgoSigner.connect();
      const accounts = await window.AlgoSigner.accounts({ ledger: 'TestNet' });
      if (accounts && accounts.length > 0) {
        return accounts[0].address;
      }
      throw new Error('No accounts found');
    } catch (error: any) {
      throw new Error(`AlgoSigner connection failed: ${error.message}`);
    }
  };

  const connectWallet = async (walletType: 'pera' | 'algorand' | 'algosigner' = 'pera') => {
    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      let address: string;

      switch (walletType) {
        case 'pera':
          address = await connectPeraWallet();
          break;
        case 'algorand':
          address = await connectAlgorandWallet();
          break;
        case 'algosigner':
          address = await connectAlgoSigner();
          break;
        default:
          throw new Error('Unsupported wallet type');
      }

      const balance = await fetchBalance(address);

      // Save connection info
      localStorage.setItem('wallet_address', address);
      localStorage.setItem('wallet_type', walletType);

      setWalletState({
        isConnected: true,
        address,
        balance,
        isConnecting: false,
        error: null,
      });

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('walletConnected', { 
        detail: { address, balance, walletType } 
      }));

    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const disconnectWallet = () => {
    const walletType = localStorage.getItem('wallet_type');
    
    try {
      // Disconnect from the specific wallet
      switch (walletType) {
        case 'pera':
          window.PeraWallet?.disconnect();
          break;
        case 'algorand':
          window.algorand?.disconnect();
          break;
        case 'algosigner':
          // AlgoSigner doesn't have a disconnect method
          break;
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }

    // Clear local storage
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_type');

    // Reset state
    setWalletState({
      isConnected: false,
      address: null,
      balance: 0,
      isConnecting: false,
      error: null,
    });

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  };

  const signTransaction = async (txn: any) => {
    const walletType = localStorage.getItem('wallet_type');
    
    if (!walletState.isConnected || !walletState.address) {
      throw new Error('Wallet not connected');
    }

    try {
      switch (walletType) {
        case 'pera':
          if (!window.PeraWallet) throw new Error('Pera Wallet not available');
          return await window.PeraWallet.signTransaction([txn], walletState.address);
        
        case 'algorand':
          if (!window.algorand) throw new Error('Algorand Wallet not available');
          return await window.algorand.signTransaction(txn);
        
        case 'algosigner':
          if (!window.AlgoSigner) throw new Error('AlgoSigner not available');
          return await window.AlgoSigner.sign(txn);
        
        default:
          throw new Error('Unknown wallet type');
      }
    } catch (error: any) {
      throw new Error(`Transaction signing failed: ${error.message}`);
    }
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    signTransaction,
  };
};