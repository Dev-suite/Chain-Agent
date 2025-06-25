import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  TrendingUp,
  Search,
  Filter,
  SortDesc,
  MessageCircle,
  Settings,
  Bot
} from 'lucide-react';
import { Button } from '../ui';
import { Character } from '../types';

interface MyAgentsSectionProps {
  characters: Character[];
  setCurrentView: (view: string) => void;
}

const MyAgentsSection: React.FC<MyAgentsSectionProps> = ({
  characters,
  setCurrentView
}) => {
  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] text-white leading-[1.1]">My AI Agents</h1>
          <p className="font-['Montserrat'] text-[16px] sm:text-[18px] font-[400] text-white/60 mt-2">Manage and interact with your deployed AI agents</p>
        </div>
        
        <Button
          variant="brand-primary"
          size={window.innerWidth < 640 ? "medium" : "large"}
          onClick={() => setCurrentView('create')}
          icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
          className="w-full sm:w-auto"
        >
          <span className="hidden sm:inline">Create New Agent</span>
          <span className="sm:hidden">Create Agent</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Agents', value: characters.length, color: 'text-brand-600' },
          { label: 'Active Agents', value: characters.filter(c => c.status === 'active').length, color: 'text-success-400' },
          { label: 'Total Interactions', value: characters.reduce((sum, c) => sum + c.gamesPlayed, 0), color: 'text-brand-400' },
          { label: 'Avg Performance', value: `${(characters.reduce((sum, c) => sum + c.winRate, 0) / characters.length || 0).toFixed(1)}%`, color: 'text-warning-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-800 rounded-[16px] sm:rounded-[20px] border border-amber-900/20 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[500] text-white/60">{stat.label}</p>
                <p className={`font-['Montserrat'] text-[24px] sm:text-[28px] font-[700] ${stat.color}`}>{stat.value}</p>
              </div>
              <TrendingUp className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-neutral-800 rounded-[16px] sm:rounded-[20px] border border-amber-900/20 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-600 font-['Montserrat'] text-[14px]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Filter className="text-white/40 w-4 h-4 sm:w-5 sm:h-5" />
            <select className="bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 font-['Montserrat'] text-[13px] sm:text-[14px]">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="training">Training</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <SortDesc className="text-white/40 w-4 h-4 sm:w-5 sm:h-5" />
            <select className="bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 font-['Montserrat'] text-[13px] sm:text-[14px]">
              <option value="name">Sort by Name</option>
              <option value="level">Sort by Level</option>
              <option value="winRate">Sort by Performance</option>
              <option value="lastActivity">Sort by Activity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="relative group bg-neutral-800 rounded-[16px] sm:rounded-[20px] border border-amber-900/20 overflow-hidden hover:border-brand-600/50 transition-all duration-300"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-[10px] sm:rounded-[12px] object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Montserrat'] text-[16px] sm:text-[20px] font-[700] text-white truncate">{character.name}</h3>
                    <p className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[400] text-white/60 truncate">{character.agentType || 'Agent'}</p>
                  </div>
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                    character.status === 'active' 
                      ? 'bg-success-900/20 text-success-400' 
                      : 'bg-neutral-900/20 text-neutral-400'
                  }`}>
                    {character.status}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[500] text-white/60">Level</span>
                    <span className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[600] text-white">{character.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[500] text-white/60">Interactions</span>
                    <span className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[600] text-white">{character.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[500] text-white/60">Win Rate</span>
                    <span className="font-['Montserrat'] text-[12px] sm:text-[14px] font-[600] text-white">{character.winRate}%</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 sm:mt-6">
                  <Button
                    variant="brand-primary"
                    size="small"
                    onClick={() => setCurrentView('chat')}
                    icon={<MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
                    className="flex-1"
                  >
                    <span className="text-[12px] sm:text-[14px]">Chat</span>
                  </Button>
                  <Button
                    variant="neutral-secondary"
                    size="small"
                    onClick={() => {}}
                    icon={<Settings className="w-3 h-3 sm:w-4 sm:h-4" />}
                    className="px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline text-[12px] sm:text-[14px]">Settings</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {characters.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-white/40 mx-auto mb-3 sm:mb-4" />
          <div className="font-['Montserrat'] text-[18px] sm:text-[20px] font-[600] text-white/60 mb-3 sm:mb-4">
            No agents created yet
          </div>
          <Button
            variant="brand-primary"
            size={window.innerWidth < 640 ? "medium" : "large"}
            onClick={() => setCurrentView('create')}
            icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="w-full sm:w-auto max-w-xs"
          >
            <span className="hidden sm:inline">Create Your First Agent</span>
            <span className="sm:hidden">Create First Agent</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyAgentsSection; 