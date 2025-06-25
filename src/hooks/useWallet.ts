import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import algosdk from 'algosdk';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  ethBalance: number;
  algoBalance: number;
  aglBalance: number;
  isConnecting: boolean;
  error: string | null;
  chainId: string | null;
  walletType: 'metamask' | 'walletconnect' | 'pera' | 'myalgo' | null;
}

export interface WalletContextType extends WalletState {
  connectWallet: (walletType?: 'metamask' | 'walletconnect' | 'pera' | 'myalgo') => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (txn: any) => Promise<any>;
  switchToAlgorandNetwork: () => Promise<void>;
  swapETHForAGL: (ethAmount: number) => Promise<void>;
  getAGLContract: () => any;
}

// AGL Token Contract Configuration
const AGL_CONTRACT_CONFIG = {
  // Sepolia Testnet (for development)
  sepolia: {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e', // This will be updated after deployment
    chainId: '0xaa36a7',
    rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  },
  // Ethereum Mainnet (for production)
  mainnet: {
    address: '0x0000000000000000000000000000000000000000', // To be deployed
    chainId: '0x1',
    rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  }
};

// AGL Token ABI
const AGL_TOKEN_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "agentId", "type": "uint256"}
    ],
    "name": "AgentCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "spender", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "algoAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "aglAmount", "type": "uint256"}
    ],
    "name": "TokensSwapped",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "AGENT_CREATION_FEE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "agentId", "type": "uint256"}],
    "name": "createAgent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAgentCreationFee",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "hasMinimumTokensForAgent",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapETHForAGL",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "recipient", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Algorand configuration
const ALGORAND_CONFIG = {
  testnet: {
    server: 'https://testnet-api.algonode.cloud',
    port: '',
    token: '',
    indexer: 'https://testnet-idx.algonode.cloud'
  },
  mainnet: {
    server: 'https://mainnet-api.algonode.cloud',
    port: '',
    token: '',
    indexer: 'https://mainnet-idx.algonode.cloud'
  }
};

declare global {
  interface Window {
    ethereum?: any;
    algorand?: any;
    AlgoSigner?: any;
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    ethBalance: 0,
    algoBalance: 0,
    aglBalance: 0,
    isConnecting: false,
    error: null,
    chainId: null,
    walletType: null,
  });

  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [algoClient, setAlgoClient] = useState<algosdk.Algodv2 | null>(null);

  // Initialize Web3 and Algorand clients
  useEffect(() => {
    initializeClients();
    checkExistingConnection();
    setupEventListeners();
    
    return () => {
      removeEventListeners();
    };
  }, []);

  const initializeClients = () => {
    // Initialize Algorand client
    const algodClient = new algosdk.Algodv2(
      ALGORAND_CONFIG.testnet.token,
      ALGORAND_CONFIG.testnet.server,
      ALGORAND_CONFIG.testnet.port
    );
    setAlgoClient(algodClient);
  };

  const checkExistingConnection = async () => {
    try {
      const savedWalletType = localStorage.getItem('wallet_type') as any;
      const savedAddress = localStorage.getItem('wallet_address');
      
      if (savedWalletType && savedAddress) {
        await connectWallet(savedWalletType);
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }
  };

  const removeEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      await updateBalances(accounts[0]);
      setWalletState(prev => ({
        ...prev,
        address: accounts[0],
        isConnected: true,
      }));
    }
  };

  const handleChainChanged = (chainId: string) => {
    setWalletState(prev => ({
      ...prev,
      chainId,
    }));
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const connectMetaMask = async (): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask extension.');
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setWalletState(prev => ({ ...prev, chainId }));
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

  const connectPeraWallet = async (): Promise<string> => {
    try {
      // This is a simplified implementation
      // In a real app, you'd use the Pera Wallet SDK
      if (!window.algorand) {
        throw new Error('Pera Wallet not found. Please install Pera Wallet.');
      }

      const accounts = await window.algorand.connect();
      if (accounts && accounts.length > 0) {
        return accounts[0];
      }
      throw new Error('No Algorand accounts found');
    } catch (error: any) {
      throw new Error(`Pera Wallet connection failed: ${error.message}`);
    }
  };

  const connectMyAlgoWallet = async (): Promise<string> => {
    try {
      // This is a simplified implementation
      // In a real app, you'd use the MyAlgo Wallet SDK
      if (!window.AlgoSigner) {
        throw new Error('MyAlgo Wallet not found. Please install MyAlgo Wallet.');
      }

      await window.AlgoSigner.connect();
      const accounts = await window.AlgoSigner.accounts({
        ledger: 'TestNet'
      });

      if (accounts && accounts.length > 0) {
        return accounts[0].address;
      }
      throw new Error('No MyAlgo accounts found');
    } catch (error: any) {
      throw new Error(`MyAlgo Wallet connection failed: ${error.message}`);
    }
  };

  const updateBalances = async (address: string) => {
    try {
      let ethBalance = 0;
      let algoBalance = 0;
      let aglBalance = 0;

      // Get ETH balance if connected via MetaMask
      if (web3 && walletState.walletType === 'metamask') {
        const ethBalanceWei = await web3.eth.getBalance(address);
        ethBalance = parseFloat(web3.utils.fromWei(ethBalanceWei, 'ether'));

        // Get AGL balance
        const aglContract = getAGLContract();
        if (aglContract) {
          const aglBalanceWei = await aglContract.methods.balanceOf(address).call();
          aglBalance = parseFloat(web3.utils.fromWei(aglBalanceWei, 'ether'));
        }
      }

      // Get ALGO balance if connected via Algorand wallet
      if (algoClient && (walletState.walletType === 'pera' || walletState.walletType === 'myalgo')) {
        try {
          const accountInfo = await algoClient.accountInformation(address).do();
          algoBalance = accountInfo.amount / 1000000; // Convert microAlgos to Algos
        } catch (error) {
          console.error('Error fetching ALGO balance:', error);
        }
      }

      setWalletState(prev => ({
        ...prev,
        ethBalance,
        algoBalance,
        aglBalance,
      }));
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  };

  const getAGLContract = () => {
    if (!web3) return null;
    
    const config = AGL_CONTRACT_CONFIG.sepolia; // Use testnet for now
    return new web3.eth.Contract(AGL_TOKEN_ABI, config.address);
  };

  const swapETHForAGL = async (ethAmount: number) => {
    if (!web3 || !walletState.address || walletState.walletType !== 'metamask') {
      throw new Error('MetaMask wallet not connected');
    }

    try {
      const aglContract = getAGLContract();
      if (!aglContract) {
        throw new Error('AGL contract not available');
      }

      const ethAmountWei = web3.utils.toWei(ethAmount.toString(), 'ether');
      
      const transaction = await aglContract.methods.swapETHForAGL().send({
        from: walletState.address,
        value: ethAmountWei,
        gas: 200000,
      });

      await updateBalances(walletState.address);
      return transaction;
    } catch (error: any) {
      throw new Error(`Swap failed: ${error.message}`);
    }
  };

  const connectWallet = async (walletType: 'metamask' | 'walletconnect' | 'pera' | 'myalgo' = 'metamask') => {
    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      let address: string;

      switch (walletType) {
        case 'metamask':
          address = await connectMetaMask();
          break;
        case 'pera':
          address = await connectPeraWallet();
          break;
        case 'myalgo':
          address = await connectMyAlgoWallet();
          break;
        default:
          throw new Error('Unsupported wallet type');
      }

      setWalletState(prev => ({
        ...prev,
        isConnected: true,
        address,
        isConnecting: false,
        error: null,
        walletType,
      }));

      // Save connection info
      localStorage.setItem('wallet_address', address);
      localStorage.setItem('wallet_type', walletType);

      // Update balances
      await updateBalances(address);

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('walletConnected', { 
        detail: { address, walletType } 
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
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_type');

    setWalletState({
      isConnected: false,
      address: null,
      ethBalance: 0,
      algoBalance: 0,
      aglBalance: 0,
      isConnecting: false,
      error: null,
      chainId: null,
      walletType: null,
    });

    setWeb3(null);

    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  };

  const signTransaction = async (txn: any) => {
    if (!walletState.isConnected || !walletState.address) {
      throw new Error('Wallet not connected');
    }

    try {
      if (walletState.walletType === 'metamask' && web3) {
        const transactionParameters = {
          to: txn.to || '0x0000000000000000000000000000000000000000',
          from: walletState.address,
          value: txn.value || '0x0',
          data: txn.data || '0x',
          gas: '0x5208',
        };

        const txHash = await web3.eth.sendTransaction(transactionParameters);
        return txHash;
      } else if (walletState.walletType === 'pera' || walletState.walletType === 'myalgo') {
        // Handle Algorand transaction signing
        // This would use the appropriate Algorand wallet SDK
        throw new Error('Algorand transaction signing not implemented yet');
      }
    } catch (error: any) {
      throw new Error(`Transaction signing failed: ${error.message}`);
    }
  };

  const switchToAlgorandNetwork = async () => {
    // This function would handle network switching for multi-chain support
    throw new Error('Network switching not implemented yet');
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    signTransaction,
    switchToAlgorandNetwork,
    swapETHForAGL,
    getAGLContract,
  };
};