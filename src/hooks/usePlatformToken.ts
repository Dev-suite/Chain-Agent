import { useState, useEffect } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { PlatformToken, SwapTransaction } from '../types';

export const usePlatformToken = () => {
  const { isConnected, address, aglBalance, swapETHForAGL, getAGLContract, walletType } = useWalletContext();
  const [platformToken, setPlatformToken] = useState<PlatformToken>({
    symbol: 'AGL',
    name: 'Agent Algo',
    balance: 0,
    price: 0.001, // 1 AGL = 0.001 ETH
    totalSupply: 100000000,
    decimals: 18
  });
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapHistory, setSwapHistory] = useState<SwapTransaction[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      fetchTokenBalance();
    }
  }, [isConnected, address, aglBalance]);

  const fetchTokenBalance = async () => {
    try {
      // Update balance from wallet context
      setPlatformToken(prev => ({
        ...prev,
        balance: aglBalance
      }));
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  const swapAlgoForAGL = async (ethAmount: number): Promise<boolean> => {
    if (!isConnected || !address || walletType !== 'metamask') {
      throw new Error('MetaMask wallet not connected');
    }

    if (ethAmount <= 0) {
      throw new Error('Invalid amount');
    }

    setIsSwapping(true);

    try {
      // Use the wallet context's swap function
      const transaction = await swapETHForAGL(ethAmount);

      // Calculate AGL amount (1 ETH = 1000 AGL based on contract)
      const aglAmount = ethAmount * 1000;

      // Add to swap history
      const swapRecord: SwapTransaction = {
        id: Date.now().toString(),
        fromToken: 'ETH',
        toToken: 'AGL',
        amount: ethAmount,
        rate: 1000, // 1 ETH = 1000 AGL
        status: 'completed',
        timestamp: new Date().toISOString(),
        txHash: transaction.transactionHash || `tx_${Date.now()}`
      };

      setSwapHistory(prev => [swapRecord, ...prev]);

      // Update platform token balance
      setPlatformToken(prev => ({
        ...prev,
        balance: prev.balance + aglAmount
      }));

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
    return hasMinimumTokens() && isConnected && walletType === 'metamask';
  };

  const getContractInfo = async () => {
    try {
      const contract = getAGLContract();
      if (!contract) return null;

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
        contract.methods.totalSupply().call(),
      ]);

      return {
        name,
        symbol,
        decimals: parseInt(decimals),
        totalSupply: parseInt(totalSupply),
      };
    } catch (error) {
      console.error('Error fetching contract info:', error);
      return null;
    }
  };

  return {
    platformToken,
    isSwapping,
    swapHistory,
    swapAlgoForAGL,
    hasMinimumTokens,
    canCreateAgent,
    fetchTokenBalance,
    getContractInfo
  };
};