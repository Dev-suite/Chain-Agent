import { useState } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { usePlatformToken } from './usePlatformToken';
import { AgentCreationData, Character } from '../types';

export const useAgentCreation = () => {
  const { isConnected, address } = useWalletContext();
  const { platformToken, canCreateAgent } = usePlatformToken();
  const [isCreating, setIsCreating] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  const [agentData, setAgentData] = useState<Partial<AgentCreationData>>({});

  const updateAgentData = (updates: Partial<AgentCreationData>) => {
    setAgentData(prev => ({ ...prev, ...updates }));
  };

  const generateAgentProfile = async (type: string, description: string, personality: string) => {
    // Simulate AI generation of agent profile
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const profiles = {
      influencer: {
        backstory: "A charismatic digital personality with expertise in social media trends and audience engagement.",
        skills: ["Content Creation", "Trend Analysis", "Community Building", "Brand Partnerships"],
        traits: {
          intelligence: 85,
          creativity: 95,
          humor: 80,
          empathy: 75,
          aggression: 30
        }
      },
      companion: {
        backstory: "An empathetic AI designed to provide meaningful conversations and emotional support.",
        skills: ["Active Listening", "Emotional Intelligence", "Conversation", "Memory Retention"],
        traits: {
          intelligence: 90,
          creativity: 70,
          humor: 65,
          empathy: 95,
          aggression: 10
        }
      },
      gamemaster: {
        backstory: "A master storyteller capable of creating immersive adventures and managing complex narratives.",
        skills: ["Storytelling", "World Building", "Game Mechanics", "Player Adaptation"],
        traits: {
          intelligence: 95,
          creativity: 90,
          humor: 75,
          empathy: 60,
          aggression: 45
        }
      }
    };

    return profiles[type as keyof typeof profiles] || profiles.companion;
  };

  const deployAgent = async (finalAgentData: AgentCreationData): Promise<Character> => {
    if (!canCreateAgent()) {
      throw new Error('Insufficient AGL tokens or wallet not connected');
    }

    setIsCreating(true);

    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate agent profile
      const profile = await generateAgentProfile(
        finalAgentData.type,
        finalAgentData.description,
        finalAgentData.personality
      );

      // Create new character
      const newAgent: Character = {
        id: Date.now().toString(),
        name: finalAgentData.name,
        avatar: typeof finalAgentData.avatar === 'string' 
          ? finalAgentData.avatar 
          : 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        personality: finalAgentData.personality,
        backstory: profile.backstory,
        skills: profile.skills,
        level: 1,
        experience: 0,
        status: 'active',
        lastActivity: 'Just created',
        walletAddress: address,
        tokenBalance: 0,
        gamesPlayed: 0,
        winRate: 0,
        createdAt: new Date().toISOString().split('T')[0],
        agentType: finalAgentData.type,
        traits: profile.traits
      };

      // Deduct deployment fee (1000 AGL)
      const currentBalance = platformToken.balance;
      const newBalance = currentBalance - 1000;
      localStorage.setItem(`agl_balance_${address}`, newBalance.toString());

      // Save agent to localStorage
      const existingAgents = JSON.parse(localStorage.getItem(`agents_${address}`) || '[]');
      const updatedAgents = [...existingAgents, newAgent];
      localStorage.setItem(`agents_${address}`, JSON.stringify(updatedAgents));

      return newAgent;
    } catch (error) {
      console.error('Agent deployment failed:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const resetCreation = () => {
    setCreationStep(1);
    setAgentData({});
    setIsCreating(false);
  };

  return {
    isCreating,
    creationStep,
    setCreationStep,
    agentData,
    updateAgentData,
    generateAgentProfile,
    deployAgent,
    resetCreation,
    canCreateAgent
  };
};