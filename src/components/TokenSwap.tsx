import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Wallet, TrendingUp, RefreshCw } from 'lucide-react';

const tokens = [
  { symbol: 'ALGO', name: 'Algorand', price: 0.25, icon: '🟢' },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, icon: '💰' },
  { symbol: 'CHAR', name: 'Character Token', price: 0.05, icon: '🤖' },
  { symbol: 'GAME', name: 'Game Token', price: 0.15, icon: '🎮' },
];

const TokenSwap: React.FC = () => {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[2]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const calculateSwap = (amount: string) => {
    if (!amount) return '';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '';
    
    const rate = fromToken.price / toToken.price;
    return (numAmount * rate).toFixed(6);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateSwap(value));
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    
    setIsSwapping(true);
    // Simulate swap transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSwapping(false);
    
    // Reset form
    setFromAmount('');
    setToAmount('');
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Token Swap</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Live Rates</span>
          </div>
        </div>

        {/* From Token */}
        <div className="space-y-4">
          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">From</span>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Wallet className="w-4 h-4" />
                <span>Balance: 1,250.75</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-600/50 rounded-lg px-3 py-2 min-w-0">
                <span className="text-2xl">{fromToken.icon}</span>
                <div>
                  <div className="text-white font-medium">{fromToken.symbol}</div>
                  <div className="text-xs text-gray-400">{fromToken.name}</div>
                </div>
              </div>
              
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-right text-2xl text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            
            <div className="text-right text-sm text-gray-400 mt-2">
              ≈ ${fromAmount ? (parseFloat(fromAmount) * fromToken.price).toFixed(2) : '0.00'}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleSwapTokens}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors"
            >
              <ArrowDownUp className="w-5 h-5" />
            </motion.button>
          </div>

          {/* To Token */}
          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">To</span>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Wallet className="w-4 h-4" />
                <span>Balance: 567.50</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-600/50 rounded-lg px-3 py-2 min-w-0">
                <span className="text-2xl">{toToken.icon}</span>
                <div>
                  <div className="text-white font-medium">{toToken.symbol}</div>
                  <div className="text-xs text-gray-400">{toToken.name}</div>
                </div>
              </div>
              
              <div className="flex-1 text-right text-2xl text-white">
                {toAmount || '0.0'}
              </div>
            </div>
            
            <div className="text-right text-sm text-gray-400 mt-2">
              ≈ ${toAmount ? (parseFloat(toAmount) * toToken.price).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="mt-4 p-3 bg-gray-700/20 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Exchange Rate</span>
            <span className="text-white">
              1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
            </span>
          </div>
        </div>

        {/* Swap Button */}
        <motion.button
          onClick={handleSwap}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
            !fromAmount || parseFloat(fromAmount) <= 0 || isSwapping
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
          }`}
        >
          {isSwapping ? (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Swapping...</span>
            </div>
          ) : (
            'Swap Tokens'
          )}
        </motion.button>

        {/* Transaction Fee */}
        <div className="mt-4 text-center text-sm text-gray-400">
          Transaction fee: 0.001 ALGO (~$0.0003)
        </div>
      </motion.div>
    </div>
  );
};

export default TokenSwap;