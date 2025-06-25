import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: 'metamask' | 'walletconnect') => Promise<void>;
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
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'walletconnect' | null>(null);

  const wallets = [
    {
      id: 'metamask' as const,
      name: 'MetaMask',
      description: 'Connect using MetaMask wallet for Ethereum and cross-chain compatibility',
      icon: '🦊',
      downloadUrl: 'https://metamask.io/download/',
      isPopular: true,
      isAvailable: typeof window !== 'undefined' && window.ethereum?.isMetaMask
    },
    {
      id: 'walletconnect' as const,
      name: 'WalletConnect',
      description: 'Connect with any WalletConnect compatible wallet',
      icon: '🔗',
      downloadUrl: 'https://walletconnect.com/',
      isPopular: false,
      isAvailable: true
    }
  ];

  const handleConnect = async (walletType: 'metamask' | 'walletconnect') => {
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
                  Choose your preferred wallet to get started
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
                  disabled={isConnecting || !wallet.isAvailable}
                  whileHover={{ scale: wallet.isAvailable ? 1.02 : 1 }}
                  whileTap={{ scale: wallet.isAvailable ? 0.98 : 1 }}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 relative ${
                    selectedWallet === wallet.id
                      ? 'border-brand-600 bg-brand-50'
                      : wallet.isAvailable
                      ? 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
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
                              Recommended
                            </span>
                          )}
                          {!wallet.isAvailable && wallet.id === 'metamask' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Not Installed
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
                    ) : wallet.isAvailable ? (
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    ) : (
                      <a
                        href={wallet.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Install
                      </a>
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
                    Secure & Decentralized
                  </p>
                  <p className="font-['Montserrat'] text-[13px] text-blue-700 mt-1">
                    Your wallet connection is encrypted and secure. We never store your private keys or have access to your funds.
                  </p>
                </div>
              </div>
            </div>

            {/* Bridge Info */}
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <p className="font-['Montserrat'] text-[14px] font-[600] text-purple-800">
                    Cross-Chain Compatibility
                  </p>
                  <p className="font-['Montserrat'] text-[13px] text-purple-700 mt-1">
                    While we use MetaMask for wallet connection, your AI agents will be deployed on the Algorand blockchain through our bridge technology.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="font-['Montserrat'] text-[12px] text-gray-600 text-center">
              New to crypto wallets?{' '}
              <a
                href="https://metamask.io/faqs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                Learn more about MetaMask
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WalletConnectModal;