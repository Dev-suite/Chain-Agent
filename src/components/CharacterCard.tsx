import React from 'react';
import { motion } from 'framer-motion';
import { Character } from '../types';
import { Bot, Zap, TrendingUp, Gamepad2, Wallet, Clock } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  const getStatusColor = (status: Character['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'idle': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Character['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'training': return 'Training';
      case 'idle': return 'Idle';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden cursor-pointer group hover:border-purple-500/50 transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={character.avatar}
          alt={character.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(character.status)} shadow-lg`} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{character.name}</h3>
          <p className="text-gray-300 text-sm">{character.personality}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Level {character.level}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(character.status)} text-white`}>
            {getStatusText(character.status)}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-300">Experience</span>
            </div>
            <span className="text-sm font-medium text-white">{character.experience.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-300">Win Rate</span>
            </div>
            <span className="text-sm font-medium text-white">{character.winRate}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-300">Games Played</span>
            </div>
            <span className="text-sm font-medium text-white">{character.gamesPlayed}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-300">Balance</span>
            </div>
            <span className="text-sm font-medium text-white">{character.tokenBalance} ALGO</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Last active: {character.lastActivity}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {character.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg text-xs text-purple-300"
            >
              {skill}
            </span>
          ))}
          {character.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-600/20 border border-gray-500/30 rounded-lg text-xs text-gray-400">
              +{character.skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterCard;