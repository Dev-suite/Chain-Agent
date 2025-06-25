import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown,
  Heart,
  Dice6,
  CheckCircle,
  Upload,
  Mic,
  Zap,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Coins
} from 'lucide-react';
import { Button, Switch } from '../ui';
import { useAgentCreation } from '../hooks/useAgentCreation';
import { usePlatformToken } from '../hooks/usePlatformToken';
import { useWalletContext } from '../contexts/WalletContext';
import TokenAcquisitionModal from './TokenAcquisitionModal';

const agentTypes = [
  {
    id: 'influencer',
    icon: Crown,
    title: 'Social Influencer Agent',
    description: 'AI-powered social media personality that engages with audiences naturally',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
    features: ['Social Media Integration', 'Audience Engagement', 'Content Generation', 'Brand Partnerships']
  },
  {
    id: 'companion',
    icon: Heart,
    title: 'AI Companion',
    description: 'Personalized AI agent for meaningful one-on-one interactions',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    features: ['Personalized Conversations', 'Memory Retention', 'Emotional Intelligence', 'Voice Interaction']
  },
  {
    id: 'gamemaster',
    icon: Dice6,
    title: 'Game Master Agent',
    description: 'Automated storyteller that creates and runs immersive RPG adventures',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    features: ['Dynamic Storytelling', 'Player Adaptation', 'World Building', 'Quest Management']
  }
];

interface CreateAgentSectionProps {
  setCurrentView: (view: string) => void;
}

const CreateAgentSection: React.FC<CreateAgentSectionProps> = ({ setCurrentView }) => {
  const { isConnected } = useWalletContext();
  const { platformToken, hasMinimumTokens, canCreateAgent } = usePlatformToken();
  const {
    isCreating,
    creationStep,
    setCreationStep,
    agentData,
    updateAgentData,
    generateAgentProfile,
    deployAgent,
    resetCreation
  } = useAgentCreation();

  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedProfile, setGeneratedProfile] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<any>(null);

  const selectedAgentType = agentTypes.find(type => type.id === agentData.type);

  const handleNext = async () => {
    if (creationStep === 1 && agentData.type) {
      setCreationStep(2);
    } else if (creationStep === 2 && agentData.name && agentData.description && agentData.personality) {
      setIsGenerating(true);
      try {
        const profile = await generateAgentProfile(
          agentData.type!,
          agentData.description!,
          agentData.personality!
        );
        setGeneratedProfile(profile);
        setCreationStep(3);
      } catch (error) {
        console.error('Failed to generate profile:', error);
      } finally {
        setIsGenerating(false);
      }
    } else if (creationStep === 3) {
      setCreationStep(4);
    }
  };

  const handleBack = () => {
    if (creationStep > 1) {
      setCreationStep(creationStep - 1);
    }
  };

  const handleDeploy = async () => {
    if (!canCreateAgent()) {
      setShowTokenModal(true);
      return;
    }

    try {
      const finalAgentData = {
        ...agentData,
        ...generatedProfile,
        platforms: ['algorand'],
        skills: generatedProfile?.skills || []
      } as any;

      const newAgent = await deployAgent(finalAgentData);
      setCreatedAgent(newAgent);
      setDeploymentComplete(true);
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  };

  const handleComplete = () => {
    resetCreation();
    setDeploymentComplete(false);
    setCreatedAgent(null);
    setGeneratedProfile(null);
    setCurrentView('agents');
  };

  // Check if user needs tokens
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="font-['Montserrat'] text-[24px] font-[700] text-white mb-2">
          Wallet Required
        </h2>
        <p className="font-['Montserrat'] text-[16px] text-white/80 text-center mb-6 max-w-md">
          Please connect your Algorand wallet to create AI agents and interact with the platform.
        </p>
        <Button variant="brand-primary" onClick={() => setCurrentView('overview')}>
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (!hasMinimumTokens() && creationStep === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Coins className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="font-['Montserrat'] text-[24px] font-[700] text-white mb-2">
          AGL Tokens Required
        </h2>
        <p className="font-['Montserrat'] text-[16px] text-white/80 text-center mb-4 max-w-md">
          You need 1,000 AGL tokens to create an AI agent. You currently have {platformToken.balance.toLocaleString()} AGL.
        </p>
        <div className="bg-white/10 rounded-lg p-4 mb-6 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80">Current Balance:</span>
            <span className="text-white font-bold">{platformToken.balance.toLocaleString()} AGL</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80">Required:</span>
            <span className="text-red-400 font-bold">1,000 AGL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Need:</span>
            <span className="text-yellow-400 font-bold">{(1000 - platformToken.balance).toLocaleString()} AGL</span>
          </div>
        </div>
        <Button 
          variant="brand-primary" 
          onClick={() => setShowTokenModal(true)}
          icon={<Coins className="w-5 h-5" />}
        >
          Get AGL Tokens
        </Button>

        <TokenAcquisitionModal
          isOpen={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          onSuccess={() => {
            // Refresh the component to show creation flow
            window.location.reload();
          }}
        />
      </div>
    );
  }

  if (deploymentComplete && createdAgent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="font-['Montserrat'] text-[32px] font-[900] text-white mb-4">
            Agent Created Successfully!
          </h2>
          <p className="font-['Montserrat'] text-[18px] text-white/80 mb-6 max-w-md">
            Your AI agent "{createdAgent.name}" is now live on the Algorand blockchain and ready to interact!
          </p>
          
          <div className="bg-white/10 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={createdAgent.avatar}
                alt={createdAgent.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <h3 className="font-['Montserrat'] text-[16px] font-[700] text-white">
                  {createdAgent.name}
                </h3>
                <p className="font-['Montserrat'] text-[14px] text-white/80">
                  {selectedAgentType?.title}
                </p>
              </div>
            </div>
            <div className="text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-white/80">Status:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Level:</span>
                <span className="text-white">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Deployment Cost:</span>
                <span className="text-white">1,000 AGL</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="brand-primary"
              onClick={handleComplete}
            >
              View My Agents
            </Button>
            <Button
              variant="brand-secondary"
              onClick={() => setCurrentView('chat')}
            >
              Start Chatting
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress Section */}
      <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex w-full max-w-[1024px] items-center justify-between">
          <span className="font-['Montserrat'] text-[24px] sm:text-[28px] lg:text-[32px] font-[900] leading-[1.1] text-white">
            Create AI Agent
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-['Montserrat'] text-[14px] sm:text-[16px] font-[500] text-white">
                {platformToken.balance.toLocaleString()} AGL
              </span>
            </div>
            <span className="font-['Montserrat'] text-[14px] sm:text-[16px] font-[500] text-white/60">
              Step {creationStep} of 4
            </span>
          </div>
        </div>
        <div className="w-full max-w-[1024px] bg-neutral-600 rounded-full h-2">
          <div 
            className="bg-brand-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(creationStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 bg-brand-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={creationStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {creationStep === 1 && (
              <div className="flex w-full flex-col items-center justify-center gap-8 sm:gap-12 px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex w-full max-w-[1024px] flex-col items-center justify-center gap-6 sm:gap-8">
                  <span className="w-full font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[1.1] text-white text-center -tracking-[0.04em]">
                    Choose Your Agent Type
                  </span>
                  <span className="max-w-[576px] font-['Montserrat'] text-[16px] sm:text-[18px] font-[400] leading-[24px] text-white/80 text-center px-4">
                    Select the type of AI agent you want to create and deploy on the Algorand blockchain
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] w-full">
                  {agentTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      onClick={() => updateAgentData({ type: type.id as any })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                        agentData.type === type.id ? 'ring-4 ring-white/50' : ''
                      }`}
                    >
                      <div className={`${type.bgColor} p-6 h-full min-h-[300px] flex flex-col justify-between`}>
                        <div>
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                            <type.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-['Montserrat'] text-[20px] font-[700] text-white mb-2">
                            {type.title}
                          </h3>
                          <p className="font-['Montserrat'] text-[14px] text-white/90 mb-4">
                            {type.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          {type.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-white/80" />
                              <span className="font-['Montserrat'] text-[12px] text-white/80">
                                {feature}
                              </span>
                            </div>
                          ))}
                          {agentData.type === type.id && (
                            <div className="flex items-center justify-center pt-3">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {creationStep === 2 && (
              <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex w-full max-w-[768px] flex-col items-center justify-center gap-4 sm:gap-6">
                  <span className="w-full font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[1.1] text-white text-center">
                    Configure Your Agent
                  </span>
                  <span className="max-w-[576px] font-['Montserrat'] text-[16px] sm:text-[18px] font-[400] leading-[24px] text-white/80 text-center px-4">
                    Define your agent's personality, behavior, and core characteristics
                  </span>
                </div>

                <div className="flex w-full max-w-[768px] flex-col gap-4 sm:gap-6">
                  <div className="flex w-full flex-col gap-3">
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                      Agent Name
                    </span>
                    <input
                      type="text"
                      value={agentData.name || ''}
                      onChange={(e) => updateAgentData({ name: e.target.value })}
                      placeholder="Enter your agent's name"
                      className="w-full px-4 py-3 font-['Montserrat'] text-[14px] bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                    />
                  </div>

                  <div className="flex w-full flex-col gap-3">
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                      Description
                    </span>
                    <textarea
                      value={agentData.description || ''}
                      onChange={(e) => updateAgentData({ description: e.target.value })}
                      placeholder="Describe what you want your agent to do and how it should behave..."
                      rows={4}
                      className="w-full px-4 py-3 font-['Montserrat'] text-[14px] bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 resize-none"
                    />
                  </div>

                  <div className="flex w-full flex-col gap-3">
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                      Personality Traits
                    </span>
                    <input
                      type="text"
                      value={agentData.personality || ''}
                      onChange={(e) => updateAgentData({ personality: e.target.value })}
                      placeholder="e.g., Friendly, Professional, Humorous, Creative"
                      className="w-full px-4 py-3 font-['Montserrat'] text-[14px] bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                    />
                  </div>

                  <div className="flex w-full flex-col gap-3">
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                      Agent Avatar
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-neutral-700 rounded-[12px] flex items-center justify-center border border-amber-800/30">
                        {agentData.avatar ? (
                          <img src={agentData.avatar as string} alt="Avatar" className="w-full h-full object-cover rounded-[12px]" />
                        ) : (
                          <Upload className="w-6 h-6 text-white/40" />
                        )}
                      </div>
                      <Button
                        variant="neutral-secondary"
                        onClick={() => {
                          // For demo, use a default avatar
                          updateAgentData({ 
                            avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400' 
                          });
                        }}
                        icon={<Upload className="w-4 h-4" />}
                      >
                        Use Default Avatar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {creationStep === 3 && generatedProfile && (
              <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex w-full max-w-[768px] flex-col items-center justify-center gap-4 sm:gap-6">
                  <span className="w-full font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[1.1] text-white text-center">
                    Review AI-Generated Profile
                  </span>
                  <span className="max-w-[576px] font-['Montserrat'] text-[16px] sm:text-[18px] font-[400] leading-[24px] text-white/80 text-center px-4">
                    Our AI has generated a complete profile for your agent. Review and customize as needed.
                  </span>
                </div>

                <div className="flex w-full max-w-[768px] flex-col gap-6">
                  <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      {selectedAgentType && (
                        <div className={`w-16 h-16 ${selectedAgentType.bgColor} rounded-[16px] flex items-center justify-center`}>
                          <selectedAgentType.icon className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-['Montserrat'] text-[24px] font-[700] text-white">
                          {agentData.name}
                        </h3>
                        <p className="font-['Montserrat'] text-[16px] text-white/80">
                          {selectedAgentType?.title}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-['Montserrat'] text-[16px] font-[600] text-white mb-2">
                          Backstory
                        </h4>
                        <p className="font-['Montserrat'] text-[14px] text-white/80 leading-relaxed">
                          {generatedProfile.backstory}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-['Montserrat'] text-[16px] font-[600] text-white mb-2">
                          Core Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedProfile.skills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-brand-600/20 border border-brand-500/30 rounded-lg text-sm text-brand-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-['Montserrat'] text-[16px] font-[600] text-white mb-3">
                          Personality Traits
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(generatedProfile.traits).map(([trait, value]) => (
                            <div key={trait} className="flex justify-between items-center">
                              <span className="font-['Montserrat'] text-[14px] text-white/80 capitalize">
                                {trait}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-neutral-600 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                                <span className="font-['Montserrat'] text-[12px] text-white/60 w-8">
                                  {value}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voice & Token Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Mic className="w-6 h-6 text-white" />
                        <h4 className="font-['Montserrat'] text-[18px] font-[700] text-white">
                          Voice Settings
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-['Montserrat'] text-[14px] text-white">
                            Enable Voice
                          </span>
                          <Switch
                            checked={agentData.voiceEnabled || false}
                            onCheckedChange={(checked) => updateAgentData({ voiceEnabled: checked })}
                          />
                        </div>
                        {agentData.voiceEnabled && (
                          <select
                            value={agentData.voiceType || 'female'}
                            onChange={(e) => updateAgentData({ voiceType: e.target.value as any })}
                            className="w-full px-3 py-2 bg-neutral-700 border border-amber-800/30 rounded-lg text-white"
                          >
                            <option value="female">Female Voice</option>
                            <option value="male">Male Voice</option>
                            <option value="neutral">Neutral Voice</option>
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-6 h-6 text-white" />
                        <h4 className="font-['Montserrat'] text-[18px] font-[700] text-white">
                          Token Generation
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-['Montserrat'] text-[14px] text-white">
                            Generate Token
                          </span>
                          <Switch
                            checked={agentData.generateToken || false}
                            onCheckedChange={(checked) => updateAgentData({ generateToken: checked })}
                          />
                        </div>
                        {agentData.generateToken && (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={agentData.tokenName || ''}
                              onChange={(e) => updateAgentData({ tokenName: e.target.value })}
                              placeholder="Token Name"
                              className="w-full px-3 py-2 bg-neutral-700 border border-amber-800/30 rounded-lg text-white placeholder-white/60"
                            />
                            <input
                              type="text"
                              value={agentData.tokenSymbol || ''}
                              onChange={(e) => updateAgentData({ tokenSymbol: e.target.value.toUpperCase() })}
                              placeholder="Symbol (e.g., AGT)"
                              className="w-full px-3 py-2 bg-neutral-700 border border-amber-800/30 rounded-lg text-white placeholder-white/60"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {creationStep === 4 && (
              <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex w-full max-w-[768px] flex-col items-center justify-center gap-4 sm:gap-6">
                  <span className="w-full font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[1.1] text-white text-center">
                    Deploy Your Agent
                  </span>
                  <span className="max-w-[576px] font-['Montserrat'] text-[16px] sm:text-[18px] font-[400] leading-[24px] text-white/80 text-center px-4">
                    Review final details and deploy your AI agent to the Algorand blockchain
                  </span>
                </div>

                <div className="flex w-full max-w-[768px] flex-col gap-6">
                  <div className="bg-neutral-800 rounded-[20px] border border-amber-900/20 p-6">
                    <h3 className="font-['Montserrat'] text-[20px] font-[700] text-white mb-6">
                      Deployment Summary
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-['Montserrat'] text-[14px] text-white/80">Agent Name</span>
                        <span className="font-['Montserrat'] text-[14px] font-[600] text-white">{agentData.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-['Montserrat'] text-[14px] text-white/80">Agent Type</span>
                        <span className="font-['Montserrat'] text-[14px] font-[600] text-white">{selectedAgentType?.title}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-['Montserrat'] text-[14px] text-white/80">Voice Enabled</span>
                        <span className="font-['Montserrat'] text-[14px] font-[600] text-white">
                          {agentData.voiceEnabled ? `Yes (${agentData.voiceType})` : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-['Montserrat'] text-[14px] text-white/80">Token Generation</span>
                        <span className="font-['Montserrat'] text-[14px] font-[600] text-white">
                          {agentData.generateToken ? `${agentData.tokenName} (${agentData.tokenSymbol})` : 'No'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-neutral-600 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-['Montserrat'] text-[18px] font-[700] text-white">
                          Deployment Cost
                        </span>
                        <span className="font-['Montserrat'] text-[24px] font-[900] text-white">
                          1,000 AGL
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="font-['Montserrat'] text-[12px] text-white/80">
                            Agent creation and blockchain deployment
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="font-['Montserrat'] text-[12px] text-white/80">
                            Smart contract initialization
                          </span>
                        </div>
                        {agentData.generateToken && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="font-['Montserrat'] text-[12px] text-white/80">
                              Token generation and liquidity setup
                            </span>
                          </div>
                        )}
                        {agentData.voiceEnabled && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="font-['Montserrat'] text-[12px] text-white/80">
                              Voice synthesis configuration
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 rounded-[20px] p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h4 className="font-['Montserrat'] text-[16px] font-[700] text-white">
                        Ready to Deploy
                      </h4>
                    </div>
                    <p className="font-['Montserrat'] text-[14px] text-white/80 mb-4">
                      Your agent configuration is complete. Click deploy to create your AI agent on the Algorand blockchain.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-['Montserrat'] text-[14px] text-white/80">
                        Current AGL Balance: {platformToken.balance.toLocaleString()}
                      </span>
                      <span className="font-['Montserrat'] text-[14px] text-green-400">
                        ✓ Sufficient funds
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex w-full items-center justify-center px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex w-full max-w-[1024px] items-center justify-between gap-4">
          <Button
            variant="neutral-secondary"
            size={window.innerWidth < 640 ? "medium" : "large"}
            onClick={handleBack}
            disabled={creationStep === 1}
            icon={<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="flex-shrink-0"
          >
            Back
          </Button>

          {creationStep === 4 ? (
            <Button
              size={window.innerWidth < 640 ? "medium" : "large"}
              onClick={handleDeploy}
              disabled={isCreating || !canCreateAgent()}
              icon={isCreating ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              className="flex-shrink-0"
            >
              {isCreating ? 'Deploying...' : 'Deploy Agent'}
            </Button>
          ) : (
            <Button
              size={window.innerWidth < 640 ? "medium" : "large"}
              onClick={handleNext}
              disabled={
                (creationStep === 1 && !agentData.type) ||
                (creationStep === 2 && (!agentData.name || !agentData.description || !agentData.personality)) ||
                isGenerating
              }
              iconRight={isGenerating ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              className="flex-shrink-0"
            >
              {isGenerating ? 'Generating...' : 'Next'}
            </Button>
          )}
        </div>
      </div>

      <TokenAcquisitionModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSuccess={() => {
          setShowTokenModal(false);
        }}
      />
    </div>
  );
};

export default CreateAgentSection;