import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy,
  Clock,
  Users,
  Zap,
  Star,
  Play
} from 'lucide-react';
import { Button } from '../ui';
import { Character } from '../types';

interface GamesSectionProps {
  characters: Character[];
}

const GamesSection: React.FC<GamesSectionProps> = ({ characters }) => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-['Montserrat'] text-[48px] font-[900] text-white leading-[48px]">
          Game Arena
        </h1>
        <p className="font-['Montserrat'] text-[18px] font-[400] text-white/60 max-w-2xl mx-auto">
          Challenge your AI characters in various games and earn rewards
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Trophy, label: 'Games Won', value: '47', color: 'text-warning-400' },
          { icon: Clock, label: 'Hours Played', value: '127', color: 'text-brand-400' },
          { icon: Users, label: 'Active Players', value: '1,234', color: 'text-success-400' },
          { icon: Zap, label: 'Total Rewards', value: '2,856', color: 'text-brand-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6"
          >
            <div className="flex items-center space-x-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="font-['Montserrat'] text-[28px] font-[700] text-white">{stat.value}</p>
                <p className="font-['Montserrat'] text-[14px] font-[500] text-white/60">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            id: '1',
            title: 'Strategy Arena',
            description: 'Test your tactical skills in this turn-based strategy game',
            image: 'https://images.pexels.com/photos/7194915/pexels-photo-7194915.jpeg?auto=compress&cs=tinysrgb&w=600',
            players: '1-4',
            difficulty: 'Hard',
            duration: '15-30 min',
            category: 'Strategy',
            rewards: '50-150 CHAR tokens'
          },
          {
            id: '2',
            title: 'Puzzle Master',
            description: 'Solve increasingly complex puzzles with your AI companion',
            image: 'https://images.pexels.com/photos/1111372/pexels-photo-1111372.jpeg?auto=compress&cs=tinysrgb&w=600',
            players: '1-2',
            difficulty: 'Medium',
            duration: '10-20 min',
            category: 'Puzzle',
            rewards: '25-75 CHAR tokens'
          },
          {
            id: '3',
            title: 'Adventure Quest',
            description: 'Embark on epic adventures in procedurally generated worlds',
            image: 'https://images.pexels.com/photos/7862333/pexels-photo-7862333.jpeg?auto=compress&cs=tinysrgb&w=600',
            players: '1-6',
            difficulty: 'Easy',
            duration: '20-45 min',
            category: 'Adventure',
            rewards: '75-200 CHAR tokens'
          },
          {
            id: '4',
            title: 'Trading Simulator',
            description: 'Practice trading strategies with virtual markets',
            image: 'https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg?auto=compress&cs=tinysrgb&w=600',
            players: '1-8',
            difficulty: 'Hard',
            duration: '30-60 min',
            category: 'Simulation',
            rewards: '100-300 CHAR tokens'
          }
        ].map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-800 rounded-[20px] border border-amber-900/20 overflow-hidden hover:border-brand-600/50 transition-all duration-300 cursor-pointer"
          >
            <div className="relative">
              <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  game.difficulty === 'Easy' ? 'bg-success-900/20 text-success-400' :
                  game.difficulty === 'Medium' ? 'bg-warning-900/20 text-warning-400' :
                  'bg-error-900/20 text-error-400'
                }`}>
                  {game.difficulty}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="font-['Montserrat'] text-[20px] font-[700] text-white">{game.title}</h3>
                <p className="font-['Montserrat'] text-[14px] text-white/80">{game.description}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="font-['Montserrat'] text-[12px] text-white/80">{game.players} players</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className="font-['Montserrat'] text-[12px] text-white/80">{game.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-warning-400" />
                  <span className="font-['Montserrat'] text-[12px] text-white/80">Rewards: {game.rewards}</span>
                </div>
                <span className="px-3 py-1 bg-brand-900/20 border border-brand-600/30 rounded-lg text-xs text-brand-400 font-['Montserrat']">
                  {game.category}
                </span>
              </div>

              <Button
                variant="brand-primary"
                onClick={() => {}}
                icon={<Play className="w-4 h-4" />}
                className="w-full"
              >
                Start Game
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Character Selection Section */}
      {characters.length > 0 && (
        <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
          <h2 className="font-['Montserrat'] text-[24px] font-[700] text-white mb-6">Select Characters for Games</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {characters.filter(c => c.status === 'active' || c.status === 'idle').map((character) => (
              <div
                key={character.id}
                className="p-4 rounded-[12px] border border-amber-800/30 hover:border-brand-600/50 transition-all duration-200 cursor-pointer bg-neutral-700/30"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-['Montserrat'] text-[16px] font-[600] text-white">{character.name}</h3>
                    <p className="font-['Montserrat'] text-[12px] text-white/60">Level {character.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesSection; 