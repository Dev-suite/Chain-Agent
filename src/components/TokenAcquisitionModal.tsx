import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpDown, Wallet, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui';
import { usePlatformToken } from '../hooks/usePlatformToken';
import { useWalletContext } from '../contexts/WalletContext';

interface TokenAcquisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TokenAcquisitionModal: React.FC<TokenAcquisitionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { balance } = useWalletContext();
  const { platformToken, isSwapping, swapAlgoForAGL, hasMinimumTokens } = usePlatformToken();
  const [algoAmount, setAlgoAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const aglAmount = algoAmount ? (parseFloat(algoAmount) / platformToken.price).toFixed(2) : '0';
  const isValidAmount = parseFloat(algoAmount) > 0 && parseFloat(algoAmount) <= balance;
  const willHaveEnough = parseFloat(aglAmount) + platformToken.balance >= 1000;

  const handleSwap = async () => {
    if (!isValidAmount) return;

    try {
      setError(null);
      await swapAlgoForAGL(parseFloat(algoAmount));
      setAlgoAmount('');
      
      if (willHaveEnough) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Swap failed');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="font-['Montserrat'] text-[20px] font-[700] text-gray-900">
                Acquire AGL Tokens
              </h2>
              <p className="font-['Montserrat'] text-[14px] text-gray-600 mt-1">
                You need 1,000 AGL tokens to create an AI agent
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Current Balance */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="font-['Montserrat'] text-[14px] font-[500] text-gray-700">
                  Current AGL Balance
                </span>
                <span className="font-['Montserrat'] text-[16px] font-[700] text-gray-900">
                  {platformToken.balance.toLocaleString()} AGL
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['Montserrat'] text-[14px] font-[500] text-gray-700">
                  Required for Agent Creation
                </span>
                <span className="font-['Montserrat'] text-[16px] font-[700] text-red-600">
                  1,000 AGL
                </span>
              </div>
              {!hasMinimumTokens() && (
                <div className="mt-2 text-center">
                  <span className="font-['Montserrat'] text-[14px] font-[600] text-red-600">
                    Need {(1000 - platformToken.balance).toLocaleString()} more AGL
                  </span>
                </div>
              )}
            </div>

            {/* Swap Interface */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-['Montserrat'] text-[12px] font-[500] text-gray-600">
                    From
                  </span>
                  <span className="font-['Montserrat'] text-[12px] text-gray-600">
                    Balance: {balance.toFixed(2)} ALGO
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-gray-900">
                      ALGO
                    </span>
                  </div>
                  <input
                    type="number"
                    value={algoAmount}
                    onChange={(e) => setAlgoAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 text-right text-xl font-bold bg-transparent outline-none"
                    step="0.1"
                    min="0"
                    max={balance}
                  />
                </div>
              </div>

              {/* Swap Icon */}
              <div className="flex justify-center">
                <div className="p-2 bg-gray-100 rounded-full">
                  <ArrowUpDown className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-['Montserrat'] text-[12px] font-[500] text-gray-600">
                    To
                  </span>
                  <span className="font-['Montserrat'] text-[12px] text-gray-600">
                    Rate: 1 ALGO = {(1 / platformToken.price).toFixed(1)} AGL
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AGL</span>
                    </div>
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-gray-900">
                      AGL
                    </span>
                  </div>
                  <div className="flex-1 text-right text-xl font-bold text-gray-900">
                    {aglAmount}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="font-['Montserrat'] text-[14px] text-red-700">{error}</span>
              </div>
            )}

            {/* Success Preview */}
            {willHaveEnough && parseFloat(aglAmount) > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-['Montserrat'] text-[14px] text-green-700 font-[600]">
                    Perfect! You'll have enough AGL tokens
                  </span>
                  <p className="font-['Montserrat'] text-[12px] text-green-600 mt-1">
                    New balance: {(platformToken.balance + parseFloat(aglAmount)).toLocaleString()} AGL
                  </p>
                </div>
              </div>
            )}

            {/* Quick Amount Buttons */}
            <div className="mt-4">
              <p className="font-['Montserrat'] text-[12px] font-[500] text-gray-600 mb-2">
                Quick amounts:
              </p>
              <div className="flex space-x-2">
                {[50, 100, 200].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAlgoAmount(amount.toString())}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    disabled={amount > balance}
                  >
                    {amount} ALGO
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Button */}
            <Button
              variant="brand-primary"
              size="large"
              onClick={handleSwap}
              disabled={!isValidAmount || isSwapping}
              className="w-full mt-6"
              icon={isSwapping ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Wallet className="w-5 h-5" />
              )}
            >
              {isSwapping ? 'Swapping...' : 'Swap Tokens'}
            </Button>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <ExternalLink className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Montserrat'] text-[12px] text-blue-700 font-[600]">
                    About AGL Tokens
                  </p>
                  <p className="font-['Montserrat'] text-[11px] text-blue-600 mt-1">
                    AGL (Agent Algo) is the platform token used for creating and managing AI agents. 
                    Each agent creation requires 1,000 AGL tokens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TokenAcquisitionModal;