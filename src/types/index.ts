export interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  backstory: string;
  skills: string[];
  level: number;
  experience: number;
  status: 'active' | 'idle' | 'training' | 'offline';
  lastActivity: string;
  voiceId?: string;
  walletAddress?: string;
  tokenBalance: number;
  gamesPlayed: number;
  winRate: number;
  createdAt: string;
  agentType?: 'influencer' | 'companion' | 'gamemaster';
  traits: {
    intelligence: number;
    creativity: number;
    humor: number;
    empathy: number;
    aggression: number;
  };
}

export interface ChatMessage {
  id: string;
  characterId: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  audioUrl?: string;
  isVoice?: boolean;
}

export interface GameSession {
  id: string;
  characterId: string;
  gameType: string;
  status: 'active' | 'completed' | 'paused';
  score: number;
  startTime: string;
  endTime?: string;
  transactions: string[];
}

export interface SwapTransaction {
  id: string;
  fromToken: string;
  toToken: string;
  amount: number;
  rate: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  txHash?: string;
}

export interface AgentToken {
  id: string;
  agentId: string;
  name: string;
  symbol: string;
  totalSupply: number;
  currentPrice: number;
  marketCap: number;
  holders: number;
  createdAt: string;
}

export interface MarketplaceAgent {
  id: string;
  name: string;
  type: 'influencer' | 'companion' | 'gamemaster';
  creator: string;
  avatar: string;
  description: string;
  price: number;
  marketCap: string;
  holders: number;
  rating: number;
  interactions: number;
  category: string;
  tags: string[];
  verified: boolean;
}