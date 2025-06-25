import { useState, useEffect } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { PlatformToken, SwapTransaction } from '../types';

export const usePlatformToken = () => {
  const { isConnected, address, signTransaction } = useWalletContext();
  const [platformToken, setPlatformToken] = useState<PlatformToken>({
    symbol: 'AGL',
    name: 'Agent Algo',
    balance: 0,
    price: 0.1, // 1 AGL = 0.1 ALGO
    totalSupply: 10000000,
    decimals: 6
  });
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapHistory, setSwapHistory] = useState<SwapTransaction[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      fetchTokenBalance();
    }
  }, [isConnected, address]);

  const fetchTokenBalance = async () => {
    try {
      // Simulate fetching AGL balance from blockchain
      // In real implementation, this would query the Algorand blockchain
      const savedBalance = localStorage.getItem(`agl_balance_${address}`);
      if (savedBalance) {
        setPlatformToken(prev => ({
          ...prev,
          balance: parseFloat(savedBalance)
        }));
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  const swapAlgoForAGL = async (algoAmount: number): Promise<boolean> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (algoAmount <= 0) {
      throw new Error('Invalid amount');
    }

    setIsSwapping(true);

    try {
      // Calculate AGL amount (1 ALGO = 10 AGL)
      const aglAmount = algoAmount / platformToken.price;

      // Create mock transaction for demonstration
      const transaction = {
        from: address,
        to: 'PLATFORM_TREASURY_ADDRESS',
        amount: algoAmount * 1000000, // Convert to microAlgos
        type: 'pay',
        note: `Swap ${algoAmount} ALGO for ${aglAmount} AGL`
      };

      // In real implementation, this would be a proper Algorand transaction
      // await signTransaction(transaction);

      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update local balance (in real app, this would come from blockchain)
      const newBalance = platformToken.balance + aglAmount;
      setPlatformToken(prev => ({
        ...prev,
        balance: newBalance
      }));

      // Save to localStorage for persistence
      localStorage.setItem(`agl_balance_${address}`, newBalance.toString());

      // Add to swap history
      const swapRecord: SwapTransaction = {
        id: Date.now().toString(),
        fromToken: 'ALGO',
        toToken: 'AGL',
        amount: algoAmount,
        rate: 1 / platformToken.price,
        status: 'completed',
        timestamp: new Date().toISOString(),
        txHash: `mock_tx_${Date.now()}`
      };

      setSwapHistory(prev => [swapRecord, ...prev]);

      return true;
    } catch (error) {
      console.error('Swap failed:', error);
      throw error;
    } finally {
      setIsSwapping(false);
    }
  };

  const hasMinimumTokens = () => {
    return platformToken.balance >= 1000;
  };

  const canCreateAgent = () => {
    return hasMinimumTokens() && isConnected;
  };

  return {
    platformToken,
    isSwapping,
    swapHistory,
    swapAlgoForAGL,
    hasMinimumTokens,
    canCreateAgent,
    fetchTokenBalance
  };
};