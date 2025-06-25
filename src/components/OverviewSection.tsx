import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Plus, 
  Store, 
  MessageCircle, 
  Users,
  Wallet,
  TrendingUp,
  Crown,
  Heart,
  Dice6
} from 'lucide-react';
import { Button } from '../ui';
import { Character } from '../types';

interface OverviewSectionProps {
  characters: Character[];
  stats: Array<{
    icon: React.ComponentType<any>;
    label: string;
    value: string | number;
    color: string;
    bg: string;
  }>;
  setCurrentView: (view: string) => void;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
  characters,
  stats,
  setCurrentView
}) => {
  const recentAgents = characters.slice(0, 3);

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Mobile Title */}
      <div className="block sm:hidden">
        <h1 className="font-['Montserrat'] text-[28px] font-[900] text-white leading-[1.1] mb-2">
          Overview
        </h1>
        <p className="font-['Montserrat'] text-[14px] font-[400] text-white/60">
          Welcome back! Here's what's happening with your agents.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-800 rounded-[16px] sm:rounded-[20px] border border-amber-900/20 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[500] text-white/60 mb-1">
                {stat.label}
              </p>
              <p className="font-['Montserrat'] text-[24px] sm:text-[28px] font-[700] text-white">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Agents */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-800 rounded-[16px] sm:rounded-[20px] border border-amber-900/20 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-['Montserrat'] text-[18px] sm:text-[20px] font-[700] text-white">
                Your Agents
              </h2>
              <Button
                variant="neutral-tertiary"
                size={window.innerWidth < 640 ? "small" : "medium"}
                onClick={() => setCurrentView('agents')}
              >
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">All</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentAgents.length > 0 ? (
                recentAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-amber-900/20 rounded-[12px] hover:bg-default-300/10 transition-colors">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-900/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                      {agent.agentType === 'influencer' && <Crown className="w-6 h-6 text-brand-600" />}
                      {agent.agentType === 'companion' && <Heart className="w-6 h-6 text-error-600" />}
                      {agent.agentType === 'gamemaster' && <Dice6 className="w-6 h-6 text-success-600" />}
                      {!agent.agentType && <Bot className="w-6 h-6 text-brand-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Montserrat'] text-[14px] sm:text-[16px] font-[600] text-white truncate">
                        {agent.name}
                      </h3>
                      <p className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[400] text-white/60 truncate">
                        {agent.agentType || 'Agent'} • {agent.gamesPlayed} interactions
                      </p>
                    </div>
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      agent.status === 'active' 
                        ? 'bg-success-900/20 text-success-400' 
                        : 'bg-neutral-900/20 text-neutral-400'
                    }`}>
                      {agent.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-white/40 mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-['Montserrat'] text-[16px] sm:text-[18px] font-[600] text-white mb-2">
                    No agents yet
                  </h3>
                  <p className="font-['Montserrat'] text-[13px] sm:text-[14px] text-white/60 mb-3 sm:mb-4 px-4">
                    Create your first AI agent to get started
                  </p>
                  <Button
                    variant="brand-primary"
                    size={window.innerWidth < 640 ? "small" : "medium"}
                    onClick={() => setCurrentView('create')}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    <span className="hidden sm:inline">Create Agent</span>
                    <span className="sm:hidden">Create</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-neutral-800 rounded-[16px] sm:rounded-[20px] border border-amber-900/20 p-4 sm:p-6">
            <h2 className="font-['Montserrat'] text-[18px] sm:text-[20px] font-[700] text-white mb-4 sm:mb-6">
              Quick Actions
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <Button
                variant="brand-primary"
                size={window.innerWidth < 640 ? "medium" : "large"}
                onClick={() => setCurrentView('create')}
                icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="w-full justify-start"
              >
                <span className="hidden sm:inline">Create New Agent</span>
                <span className="sm:hidden">Create Agent</span>
              </Button>
              <Button
                variant="neutral-secondary"
                size={window.innerWidth < 640 ? "medium" : "large"}
                onClick={() => setCurrentView('marketplace')}
                icon={<Store className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="w-full justify-start"
              >
                <span className="hidden sm:inline">Browse Marketplace</span>
                <span className="sm:hidden">Marketplace</span>
              </Button>
              <Button
                variant="neutral-secondary"
                size={window.innerWidth < 640 ? "medium" : "large"}
                onClick={() => setCurrentView('chat')}
                icon={<MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="w-full justify-start"
              >
                <span className="hidden sm:inline">Start Chat</span>
                <span className="sm:hidden">Chat</span>
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-neutral-800 rounded-[16px] sm:rounded-[20px] border border-amber-900/20 p-4 sm:p-6">
            <h2 className="font-['Montserrat'] text-[18px] sm:text-[20px] font-[700] text-white mb-4 sm:mb-6">
              Recent Activity
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-['Montserrat'] text-[13px] sm:text-[14px] font-[500] text-white">
                    Agent deployed
                  </p>
                  <p className="font-['Montserrat'] text-[11px] sm:text-[12px] text-white/60">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-['Montserrat'] text-[14px] font-[500] text-white">
                    New interaction received
                  </p>
                  <p className="font-['Montserrat'] text-[12px] text-white/60">
                    5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-['Montserrat'] text-[14px] font-[500] text-white">
                    Token swap completed
                  </p>
                  <p className="font-['Montserrat'] text-[12px] text-white/60">
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection; 