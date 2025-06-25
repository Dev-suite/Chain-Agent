import React from 'react';
import { 
  ArrowUpDown,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui';

interface TokenSwapSectionProps {}

const TokenSwapSection: React.FC<TokenSwapSectionProps> = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-['Montserrat'] text-[48px] font-[900] text-white leading-[48px]">
          Token Swap
        </h1>
        <p className="font-['Montserrat'] text-[18px] font-[400] text-white/60 max-w-2xl mx-auto">
          Seamlessly swap tokens on the Algorand blockchain with optimal rates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Swap Interface */}
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
            <h3 className="font-['Montserrat'] text-[24px] font-[700] text-white mb-6">Swap Tokens</h3>
            
            {/* From Token */}
            <div className="space-y-4">
              <div className="bg-neutral-700 rounded-[12px] p-4">
                <label className="font-['Montserrat'] text-[12px] font-[500] text-white/60 mb-2 block">From</label>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="bg-transparent text-white text-[24px] font-[700] placeholder-white/40 outline-none flex-1"
                  />
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="w-6 h-6 bg-brand-600 rounded-full"></div>
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">ALGO</span>
                    <button className="text-white/60 hover:text-white transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-['Montserrat'] text-[12px] text-white/60 mt-2">Balance: 1,234.56 ALGO</p>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button className="w-10 h-10 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center transition-colors">
                  <ArrowUpDown className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* To Token */}
              <div className="bg-neutral-700 rounded-[12px] p-4">
                <label className="font-['Montserrat'] text-[12px] font-[500] text-white/60 mb-2 block">To</label>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="bg-transparent text-white text-[24px] font-[700] placeholder-white/40 outline-none flex-1"
                  />
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="w-6 h-6 bg-error-600 rounded-full"></div>
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">CHAR</span>
                    <button className="text-white/60 hover:text-white transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-['Montserrat'] text-[12px] text-white/60 mt-2">Balance: 5,432.10 CHAR</p>
              </div>

              <Button variant="brand-primary" className="w-full" onClick={() => {}}>
                Swap Tokens
              </Button>
            </div>
          </div>
          
          {/* Market Stats */}
          <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
            <h3 className="font-['Montserrat'] text-[20px] font-[700] text-white mb-4">Market Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'ALGO/USD', value: '$0.25', change: '+2.5%', positive: true },
                { label: 'CHAR/USD', value: '$0.05', change: '+8.2%', positive: true },
                { label: 'GAME/USD', value: '$0.15', change: '-1.8%', positive: false },
                { label: 'Volume 24h', value: '$125K', change: '+15.7%', positive: true }
              ].map((stat, index) => (
                <div key={index} className="bg-neutral-700/30 rounded-[12px] p-3">
                  <p className="font-['Montserrat'] text-[12px] text-white/60">{stat.label}</p>
                  <p className="font-['Montserrat'] text-[16px] font-[600] text-white">{stat.value}</p>
                  <p className={`font-['Montserrat'] text-[12px] ${stat.positive ? 'text-success-400' : 'text-error-400'}`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Montserrat'] text-[20px] font-[700] text-white">Recent Swaps</h3>
              <RefreshCw className="w-5 h-5 text-white/60 cursor-pointer hover:text-white transition-colors" />
            </div>

            <div className="space-y-4">
              {[
                { id: '1', from: 'ALGO', to: 'CHAR', amount: '100', timestamp: '2 minutes ago', status: 'completed' },
                { id: '2', from: 'CHAR', to: 'USDC', amount: '500', timestamp: '15 minutes ago', status: 'completed' },
                { id: '3', from: 'USDC', to: 'ALGO', amount: '75', timestamp: '1 hour ago', status: 'completed' },
                { id: '4', from: 'GAME', to: 'CHAR', amount: '200', timestamp: '2 hours ago', status: 'pending' }
              ].map((swap) => (
                <div key={swap.id} className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-[12px]">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-['Montserrat'] text-[14px] font-[600] text-white">{swap.from}</span>
                      <ArrowRight className="w-4 h-4 text-white/60" />
                      <span className="font-['Montserrat'] text-[14px] font-[600] text-white">{swap.to}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-['Montserrat'] text-[14px] font-[600] text-white">{swap.amount}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        swap.status === 'completed' ? 'bg-success-500' : 'bg-warning-500'
                      }`} />
                      <span className="font-['Montserrat'] text-[12px] text-white/60">{swap.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liquidity Pools */}
          <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
            <h3 className="font-['Montserrat'] text-[20px] font-[700] text-white mb-4 flex items-center space-x-2">
              <DollarSign className="w-6 h-6" />
              <span>Top Liquidity Pools</span>
            </h3>
            
            <div className="space-y-3">
              {[
                { pair: 'ALGO/USDC', tvl: '$2.5M', apr: '12.5%' },
                { pair: 'CHAR/ALGO', tvl: '$850K', apr: '18.2%' },
                { pair: 'GAME/USDC', tvl: '$620K', apr: '15.7%' },
                { pair: 'CHAR/USDC', tvl: '$445K', apr: '22.1%' }
              ].map((pool, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-700/30 rounded-[12px] hover:bg-neutral-700/50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-['Montserrat'] text-[16px] font-[600] text-white">{pool.pair}</p>
                    <p className="font-['Montserrat'] text-[12px] text-white/60">TVL: {pool.tvl}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-['Montserrat'] text-[16px] font-[600] text-success-400">{pool.apr} APR</p>
                    <p className="font-['Montserrat'] text-[12px] text-white/60">Rewards</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenSwapSection; 