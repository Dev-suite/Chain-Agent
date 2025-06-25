import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, User, AlertTriangle } from 'lucide-react';
import { Button } from '../ui';
import { useWalletContext } from '../contexts/WalletContext';
import WalletConnectModal from './WalletConnectModal';

const WalletButton: React.FC = () => {
  const { 
    isConnected, 
    address, 
    balance, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet,
    chainId 
  } = useWalletContext();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async (walletType: 'metamask' | 'walletconnect') => {
    await connectWallet(walletType);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  const getNetworkName = (chainId: string | null) => {
    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x5':
        return 'Goerli Testnet';
      case '0x89':
        return 'Polygon';
      default:
        return 'Unknown Network';
    }
  };

  if (!isConnected) {
    return (
      <>
        <Button
          variant="brand-primary"
          onClick={() => setShowModal(true)}
          disabled={isConnecting}
          icon={isConnecting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>

        <WalletConnectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConnect={handleConnect}
          isConnecting={isConnecting}
          error={error}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <p className="font-['Montserrat'] text-[14px] font-[600] text-gray-900">
            {formatAddress(address!)}
          </p>
          <p className="font-['Montserrat'] text-[12px] text-gray-600">
            {balance.toFixed(4)} ETH
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
          showDropdown ? 'rotate-180' : ''
        }`} />
      </motion.button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Content */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-['Montserrat'] text-[14px] font-[600] text-gray-900">
                    Connected Wallet
                  </p>
                  <p className="font-['Montserrat'] text-[12px] text-gray-600">
                    {balance.toFixed(6)} ETH
                  </p>
                </div>
              </div>
            </div>

            {/* Network Info */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-['Montserrat'] text-[12px] text-gray-600">
                  Network
                </span>
                <span className="font-['Montserrat'] text-[12px] font-[600] text-gray-800">
                  {getNetworkName(chainId)}
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-['Montserrat'] text-[11px] text-purple-700">
                  Bridged to Algorand for AI agent deployment
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 border-b border-gray-100">
              <p className="font-['Montserrat'] text-[12px] text-gray-600 mb-2">
                Wallet Address
              </p>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="font-['Montserrat'] text-[13px] font-mono text-gray-800">
                  {formatAddress(address!)}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={copyAddress}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy address"
                  >
                    <Copy className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={openEtherscan}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bridge Notice */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Montserrat'] text-[12px] font-[600] text-blue-800">
                    Cross-Chain Bridge Active
                  </p>
                  <p className="font-['Montserrat'] text-[11px] text-blue-700 mt-1">
                    Your MetaMask wallet is connected via our Algorand bridge. AI agents will be deployed on Algorand blockchain.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={() => {
                  disconnectWallet();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-['Montserrat'] text-[14px] font-[500]">
                  Disconnect Wallet
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default WalletButton;