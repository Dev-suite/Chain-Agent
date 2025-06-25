import React from 'react';

interface WalletSectionProps {}

const WalletSection: React.FC<WalletSectionProps> = () => {
  return (
    <div className="p-6">
      <div className="text-center text-white">
        <h2 className="font-['Montserrat'] text-[32px] font-[700] mb-4">Wallet</h2>
        <p className="text-white/60">Wallet management coming soon...</p>
      </div>
    </div>
  );
};

export default WalletSection; 