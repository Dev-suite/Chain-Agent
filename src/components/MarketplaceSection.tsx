import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  TrendingUp,
  Zap,
  Star,
  Search,
  Crown,
  Heart,
  Dice6,
  Eye,
  MessageCircle
} from 'lucide-react';
import { Button } from '../ui';

interface MarketplaceSectionProps {
  setCurrentView: (view: string) => void;
}

const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ setCurrentView }) => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-['Montserrat'] text-[48px] font-[900] text-white leading-[48px]">
          Agent Marketplace
        </h1>
        <p className="font-['Montserrat'] text-[18px] font-[400] text-white/60 max-w-2xl mx-auto">
          Discover, invest in, and interact with AI agents created by the community
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Agents', value: '1,247', icon: Users, color: 'text-brand-600' },
          { label: 'Total Volume', value: '$2.4M', icon: TrendingUp, color: 'text-success-400' },
          { label: 'Active Traders', value: '8,932', icon: Zap, color: 'text-brand-400' },
          { label: 'Avg Rating', value: '4.7★', icon: Star, color: 'text-warning-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Montserrat'] text-[14px] font-[500] text-white/60">{stat.label}</p>
                <p className={`font-['Montserrat'] text-[28px] font-[700] ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents, creators, or tags..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-600 font-['Montserrat'] text-[14px]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select className="bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 font-['Montserrat'] text-[14px]">
              <option value="all">All Types</option>
              <option value="influencer">Social Influencer</option>
              <option value="companion">AI Companion</option>
              <option value="gamemaster">Game Master</option>
            </select>

            <select className="bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 font-['Montserrat'] text-[14px]">
              <option value="all">All Prices</option>
              <option value="low">Under 200 ALGO</option>
              <option value="mid">200-350 ALGO</option>
              <option value="high">350+ ALGO</option>
            </select>

            <select className="bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 font-['Montserrat'] text-[14px]">
              <option value="popular">Most Popular</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
              <option value="new">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: '1',
            name: 'Luna the Influencer',
            type: 'influencer',
            creator: 'AlgoCreator',
            avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Fashion and lifestyle influencer with 50K+ engaged followers',
            price: 250,
            marketCap: '125K',
            holders: 1250,
            rating: 4.8,
            interactions: 15680,
            tags: ['Fashion', 'Lifestyle', 'Beauty'],
            verified: true
          },
          {
            id: '2',
            name: 'Sage the Companion',
            type: 'companion',
            creator: 'MindfulAI',
            avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Empathetic AI companion specializing in mental wellness and support',
            price: 180,
            marketCap: '89K',
            holders: 890,
            rating: 4.9,
            interactions: 12450,
            tags: ['Mental Health', 'Support', 'Meditation'],
            verified: true
          },
          {
            id: '3',
            name: 'Dungeon Master Zyx',
            type: 'gamemaster',
            creator: 'RPGLegends',
            avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'Master storyteller creating epic D&D campaigns and adventures',
            price: 320,
            marketCap: '156K',
            holders: 1560,
            rating: 4.7,
            interactions: 9875,
            tags: ['D&D', 'Storytelling', 'RPG'],
            verified: true
          }
        ].map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-neutral-800 rounded-[20px] border border-amber-900/20 overflow-hidden hover:border-brand-600/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  agent.type === 'influencer' ? 'bg-brand-600' : 
                  agent.type === 'companion' ? 'bg-error-600' : 'bg-success-600'
                }`}>
                  {agent.type === 'influencer' && <Crown className="w-5 h-5 text-white" />}
                  {agent.type === 'companion' && <Heart className="w-5 h-5 text-white" />}
                  {agent.type === 'gamemaster' && <Dice6 className="w-5 h-5 text-white" />}
                </div>
              </div>
              {agent.verified && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="font-['Montserrat'] text-[20px] font-[700] text-white">{agent.name}</h3>
                <p className="font-['Montserrat'] text-[14px] text-white/80">by {agent.creator}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="font-['Montserrat'] text-[14px] text-white/80 leading-relaxed">{agent.description}</p>

              <div className="flex flex-wrap gap-1">
                {agent.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-brand-900/20 border border-brand-600/30 rounded-lg text-xs text-brand-400 font-['Montserrat']"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-['Montserrat'] text-[12px] text-white/60">Market Cap</span>
                  <span className="font-['Montserrat'] text-[12px] font-[600] text-white">${agent.marketCap}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Montserrat'] text-[12px] text-white/60">Holders</span>
                  <span className="font-['Montserrat'] text-[12px] font-[600] text-white">{agent.holders.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Montserrat'] text-[12px] text-white/60">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-warning-400 fill-current" />
                    <span className="font-['Montserrat'] text-[12px] font-[600] text-white">{agent.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Montserrat'] text-[12px] text-white/60">Interactions</span>
                  <span className="font-['Montserrat'] text-[12px] font-[600] text-white">{agent.interactions.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-amber-900/20">
                <div>
                  <p className="font-['Montserrat'] text-[20px] font-[700] text-white">{agent.price} ALGO</p>
                  <p className="font-['Montserrat'] text-[12px] text-white/60">Current Price</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="neutral-secondary"
                    size="small"
                    onClick={() => {}}
                    icon={<Eye className="w-4 h-4" />}
                  />
                  <Button
                    variant="neutral-secondary"
                    size="small"
                    onClick={() => setCurrentView('chat')}
                    icon={<MessageCircle className="w-4 h-4" />}
                  />
                  <Button
                    variant="brand-primary"
                    size="small"
                    onClick={() => {}}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceSection; 