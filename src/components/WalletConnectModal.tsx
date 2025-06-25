import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: 'pera' | 'algorand' | 'algosigner') => Promise<void>;
  isConnecting: boolean;
  error: string | null;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
  error
}) => {
  const [selectedWallet, setSelectedWallet] = useState<'pera' | 'algorand' | 'algosigner' | null>(null);

  const wallets = [
    {
      id: 'pera' as const,
      name: 'Pera Wallet',
      description: 'The official Algorand wallet with mobile and web support',
      icon: '🔷',
      downloadUrl: 'https://perawallet.app/',
      isPopular: true
    },
    {
      id: 'algosigner' as const,
      name: 'AlgoSigner',
      description: 'Browser extension wallet for Algorand',
      icon: '🔐',
      downloadUrl: 'https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm',
      isPopular: false
    },
    {
      id: 'algorand' as const,
      name: 'Other Algorand Wallets',
      description: 'Connect with any Algorand-compatible wallet',
      icon: '⚡',
      downloadUrl: 'https://algorand.org/ecosystem/wallets',
      isPopular: false
    }
  ];

  const handleConnect = async (walletType: 'pera' | 'algorand' | 'algosigner') => {
    setSelectedWallet(walletType);
    try {
      await onConnect(walletType);
      onClose();
    } catch (error) {
      // Error is handled by the parent component
    }
    setSelectedWallet(null);
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-['Montserrat'] text-[20px] font-[700] text-gray-900">
                  Connect Wallet
                </h2>
                <p className="font-['Montserrat'] text-[14px] text-gray-600">
                  Choose your preferred Algorand wallet
                </p>
              </div>
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
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Montserrat'] text-[14px] font-[600] text-red-800">
                    Connection Failed
                  </p>
                  <p className="font-['Montserrat'] text-[13px] text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {wallets.map((wallet) => (
                <motion.button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 relative ${
                    selectedWallet === wallet.id
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                  } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-['Montserrat'] text-[16px] font-[600] text-gray-900">
                            {wallet.name}
                          </h3>
                          {wallet.isPopular && (
                            <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="font-['Montserrat'] text-[13px] text-gray-600 mt-1">
                          {wallet.description}
                        </p>
                      </div>
                    </div>
                    
                    {selectedWallet === wallet.id && isConnecting ? (
                      <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Montserrat'] text-[14px] font-[600] text-blue-800">
                    Secure Connection
                  </p>
                  <p className="font-['Montserrat'] text-[13px] text-blue-700 mt-1">
                    Your wallet connection is encrypted and secure. We never store your private keys.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="font-['Montserrat'] text-[12px] text-gray-600 text-center">
              Don't have a wallet?{' '}
              <a
                href="https://algorand.org/ecosystem/wallets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                Download one here
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WalletConnectModal;