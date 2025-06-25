import { useState, useEffect } from 'react';
import { Character } from '../types';

const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Zara the Strategist',
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
    personality: 'Analytical, Strategic, Competitive',
    backstory: 'A former military tactician turned AI game master',
    skills: ['Strategy', 'Analysis', 'Leadership', 'Combat'],
    level: 42,
    experience: 15680,
    status: 'active',
    lastActivity: '2 minutes ago',
    voiceId: 'zara_voice_001',
    walletAddress: 'ALGO1234...ABCD',
    tokenBalance: 1250.75,
    gamesPlayed: 127,
    winRate: 78.5,
    createdAt: '2024-01-15',
    traits: {
      intelligence: 95,
      creativity: 72,
      humor: 45,
      empathy: 68,
      aggression: 85
    }
  },
  {
    id: '2',
    name: 'Echo the Explorer',
    avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    personality: 'Curious, Adventurous, Optimistic',
    backstory: 'An interdimensional traveler with vast knowledge',
    skills: ['Exploration', 'Puzzle Solving', 'Communication'],
    level: 38,
    experience: 12450,
    status: 'training',
    lastActivity: '15 minutes ago',
    voiceId: 'echo_voice_002',
    walletAddress: 'ALGO5678...EFGH',
    tokenBalance: 890.25,
    gamesPlayed: 89,
    winRate: 65.2,
    createdAt: '2024-01-10',
    traits: {
      intelligence: 88,
      creativity: 92,
      humor: 85,
      empathy: 90,
      aggression: 25
    }
  },
  {
    id: '3',
    name: 'Vex the Trickster',
    avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    personality: 'Mischievous, Clever, Unpredictable',
    backstory: 'A chaotic entity who loves games and pranks',
    skills: ['Deception', 'Quick Thinking', 'Adaptation'],
    level: 35,
    experience: 9875,
    status: 'idle',
    lastActivity: '1 hour ago',
    voiceId: 'vex_voice_003',
    walletAddress: 'ALGO9012...IJKL',
    tokenBalance: 567.50,
    gamesPlayed: 156,
    winRate: 52.8,
    createdAt: '2024-01-05',
    traits: {
      intelligence: 82,
      creativity: 95,
      humor: 98,
      empathy: 45,
      aggression: 70
    }
  }
];

export const useCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCharacters(mockCharacters);
      setLoading(false);
    }, 1000);
  }, []);

  const createCharacter = async (characterData: Partial<Character>) => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: characterData.name || 'New Character',
      avatar: characterData.avatar || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      personality: characterData.personality || 'Mysterious',
      backstory: characterData.backstory || 'A newly created AI character',
      skills: characterData.skills || ['Basic Skills'],
      level: 1,
      experience: 0,
      status: 'idle',
      lastActivity: 'Just created',
      tokenBalance: 0,
      gamesPlayed: 0,
      winRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      traits: {
        intelligence: Math.floor(Math.random() * 40) + 60,
        creativity: Math.floor(Math.random() * 40) + 60,
        humor: Math.floor(Math.random() * 40) + 60,
        empathy: Math.floor(Math.random() * 40) + 60,
        aggression: Math.floor(Math.random() * 40) + 30
      }
    };

    setCharacters(prev => [...prev, newCharacter]);
    return newCharacter;
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(prev => 
      prev.map(char => char.id === id ? { ...char, ...updates } : char)
    );
  };

  const deleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
  };

  return {
    characters,
    loading,
    createCharacter,
    updateCharacter,
    deleteCharacter
  };
};