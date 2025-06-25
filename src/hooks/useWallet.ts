import { useState, useEffect } from 'react';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  isConnecting: boolean;
  error: string | null;
  chainId: string | null;
}

export interface WalletContextType extends WalletState {
  connectWallet: (walletType?: 'metamask' | 'walletconnect') => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (txn: any) => Promise<any>;
  switchToAlgorandNetwork: () => Promise<void>;
}

// MetaMask Ethereum provider types
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (data: any) => void) => void;
      removeListener: (event: string, callback: (data: any) => void) => void;
      selectedAddress: string | null;
      chainId: string | null;
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
    chainId: null,
  });

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection();
    setupEventListeners();
    
    return () => {
      removeEventListeners();
    };
  }, []);

  const checkExistingConnection = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        const balance = await fetchBalance(accounts[0]);
        setWalletState({
          isConnected: true,
          address: accounts[0],
          balance,
          isConnecting: false,
          error: null,
          chainId,
        });
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const setupEventListeners = () => {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);
  };

  const removeEventListeners = () => {
    if (!window.ethereum) return;

    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
    window.ethereum.removeListener('disconnect', handleDisconnect);
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      const balance = await fetchBalance(accounts[0]);
      setWalletState(prev => ({
        ...prev,
        address: accounts[0],
        balance,
        isConnected: true,
      }));
    }
  };

  const handleChainChanged = (chainId: string) => {
    setWalletState(prev => ({
      ...prev,
      chainId,
    }));
    // Reload the page to reset the dapp state
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const fetchBalance = async (address: string): Promise<number> => {
    try {
      if (!window.ethereum) return 0;

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });

      // Convert from Wei to ETH (for demo purposes, we'll treat this as ALGO equivalent)
      const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
      return ethBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };

  const connectMetaMask = async (): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask extension.');
    }

    if (!window.ethereum.isMetaMask) {
      throw new Error('Please use MetaMask wallet.');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        return accounts[0];
      }
      throw new Error('No accounts found');
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw new Error(`MetaMask connection failed: ${error.message}`);
    }
  };

  const switchToAlgorandNetwork = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      // For demo purposes, we'll use a custom network ID to represent Algorand
      // In a real implementation, you'd use a proper Algorand-compatible network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Ethereum mainnet for demo
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added, add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x1',
            chainName: 'Ethereum Mainnet (Algorand Bridge)',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet.infura.io/v3/'],
            blockExplorerUrls: ['https://etherscan.io/'],
          }],
        });
      } else {
        throw error;
      }
    }
  };

  const connectWallet = async (walletType: 'metamask' | 'walletconnect' = 'metamask') => {
    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      let address: string;

      switch (walletType) {
        case 'metamask':
          address = await connectMetaMask();
          break;
        case 'walletconnect':
          throw new Error('WalletConnect not implemented yet');
        default:
          throw new Error('Unsupported wallet type');
      }

      const balance = await fetchBalance(address);
      const chainId = await window.ethereum!.request({ method: 'eth_chainId' });

      setWalletState({
        isConnected: true,
        address,
        balance,
        isConnecting: false,
        error: null,
        chainId,
      });

      // Save connection info
      localStorage.setItem('wallet_address', address);
      localStorage.setItem('wallet_type', walletType);

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
      chainId: null,
    });

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  };

  const signTransaction = async (txn: any) => {
    if (!walletState.isConnected || !walletState.address) {
      throw new Error('Wallet not connected');
    }

    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }

    try {
      // For demo purposes, we'll create a simple transaction
      const transactionParameters = {
        to: txn.to || '0x0000000000000000000000000000000000000000',
        from: walletState.address,
        value: txn.value || '0x0',
        data: txn.data || '0x',
        gasPrice: '0x09184e72a000',
        gas: '0x2710',
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return txHash;
    } catch (error: any) {
      throw new Error(`Transaction signing failed: ${error.message}`);
    }
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    signTransaction,
    switchToAlgorandNetwork,
  };
};