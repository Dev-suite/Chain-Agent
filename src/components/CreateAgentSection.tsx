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
  Sparkles
} from 'lucide-react';
import { Button, Switch } from '../ui';

const agentTypes = [
  {
    id: 'influencer',
    icon: Crown,
    title: 'Social Influencer Agent',
    description: 'AI-powered social media personality that engages with audiences',
    color: 'bg-brand-300',
    features: ['Social Media Integration', 'Audience Engagement', 'Content Generation', 'Brand Partnerships'],
    minTokens: 1000
  },
  {
    id: 'companion',
    icon: Heart,
    title: 'AI Companion',
    description: 'Personalized AI agent for meaningful one-on-one interactions',
    color: 'bg-error-900',
    features: ['Personalized Conversations', 'Memory Retention', 'Emotional Intelligence', 'Voice Interaction'],
    minTokens: 1000
  },
  {
    id: 'gamemaster',
    icon: Dice6,
    title: 'Game Master Agent',
    description: 'Automated storyteller that creates and runs immersive RPG adventures',
    color: 'bg-neutral-800',
    features: ['Dynamic Storytelling', 'Player Adaptation', 'World Building', 'Quest Management'],
    minTokens: 1000
  }
];

interface CreateAgentSectionProps {
  setCurrentView: (view: string) => void;
}

const CreateAgentSection: React.FC<CreateAgentSectionProps> = ({ setCurrentView }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    personality: '',
    avatar: '',
    voiceEnabled: false,
    voiceType: 'female',
    generateToken: true,
    tokenName: '',
    tokenSymbol: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [creationComplete, setCreationComplete] = useState(false);

  const selectedAgentType = agentTypes.find(type => type.id === selectedType);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAgent = async () => {
    setIsCreating(true);
    // Simulate agent creation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsCreating(false);
    setCreationComplete(true);
  };

  const resetCreateAgent = () => {
    setCreationComplete(false);
    setCurrentStep(1);
    setSelectedType('');
    setAgentData({
      name: '',
      description: '',
      personality: '',
      avatar: '',
      voiceEnabled: false,
      voiceType: 'female',
      generateToken: true,
      tokenName: '',
      tokenSymbol: ''
    });
  };

  const renderCreateAgentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex w-full flex-col items-center justify-center gap-8 sm:gap-12 px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex w-full max-w-[1024px] flex-col items-center justify-center gap-6 sm:gap-8">
              <span className="w-full font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[1.1] text-white text-center -tracking-[0.04em]">
                Choose Your Agent Type
              </span>
              <span className="max-w-[576px] font-['Montserrat'] text-[16px] sm:text-[18px] font-[400] leading-[24px] text-white/80 text-center px-4">
                Select the type of AI agent you want to create and deploy on the Algorand blockchain
              </span>
            </div>

            <div className="flex w-full max-w-[1280px] flex-col lg:flex-row lg:flex-wrap items-center justify-center gap-4 sm:gap-6">
              {agentTypes.map((type) => (
                <motion.div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex min-h-[280px] sm:min-h-[320px] w-full lg:min-w-[280px] lg:max-w-[320px] lg:grow lg:shrink-0 lg:basis-0 flex-col items-start justify-between gap-4 sm:gap-6 self-stretch rounded-[16px] sm:rounded-[24px] px-4 sm:px-6 py-4 sm:py-6 cursor-pointer transition-all duration-200 ${
                    type.color
                  } ${selectedType === type.id ? 'ring-2 sm:ring-4 ring-white/50' : ''}`}
                >
                  <div className="flex w-full flex-col items-start justify-start gap-4">
                    <div className={`flex w-12 h-12 items-center justify-center rounded-xl ${
                      type.id === 'influencer' ? 'bg-brand-900/20' : 'bg-white/20'
                    }`}>
                      <type.icon className={`w-6 h-6 ${
                        type.id === 'influencer' ? 'text-brand-900' : 'text-white'
                      }`} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`font-['Montserrat'] text-[20px] font-[700] leading-[24px] ${
                        type.id === 'influencer' ? 'text-brand-900' : 'text-white'
                      }`}>
                        {type.title}
                      </span>
                      <span className={`font-['Montserrat'] text-[14px] font-[400] leading-[20px] ${
                        type.id === 'influencer' ? 'text-brand-900/80' : 'text-white/80'
                      }`}>
                        {type.description}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex w-full flex-col gap-3">
                    {type.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${
                          type.id === 'influencer' ? 'text-brand-900/60' : 'text-white/60'
                        }`} />
                        <span className={`font-['Montserrat'] text-[12px] font-[500] ${
                          type.id === 'influencer' ? 'text-brand-900/80' : 'text-white/80'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                    <div className={`flex items-center justify-between pt-3 border-t ${
                      type.id === 'influencer' ? 'border-brand-900/20' : 'border-white/20'
                    }`}>
                      <span className={`font-['Montserrat'] text-[14px] font-[600] ${
                        type.id === 'influencer' ? 'text-brand-900' : 'text-white'
                      }`}>
                        Min: {type.minTokens} ALGO
                      </span>
                      {selectedType === type.id && (
                        <CheckCircle className={`w-5 h-5 ${
                          type.id === 'influencer' ? 'text-brand-900' : 'text-white'
                        }`} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
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
                  value={agentData.name}
                  onChange={(e) => setAgentData({...agentData, name: e.target.value})}
                  placeholder="Enter your agent's name"
                  className="w-full px-4 py-3 font-['Montserrat'] text-[14px] bg-neutral-700 border border-amber-800/30 rounded-[12px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>

              <div className="flex w-full flex-col gap-3">
                <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                  Description
                </span>
                <textarea
                  value={agentData.description}
                  onChange={(e) => setAgentData({...agentData, description: e.target.value})}
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
                  value={agentData.personality}
                  onChange={(e) => setAgentData({...agentData, personality: e.target.value})}
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
                      <img src={agentData.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[12px]" />
                    ) : (
                      <Upload className="w-6 h-6 text-white/40" />
                    )}
                  </div>
                  <Button
                    variant="neutral-secondary"
                    onClick={() => {}}
                    icon={<Upload className="w-4 h-4" />}
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex w-full max-w-[768px] flex-col items-center justify-center gap-4 sm:gap-6">
              <span className="w-full font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[1.1] text-white text-center">
                Voice & Token Settings
              </span>
              <span className="max-w-[576px] font-['Montserrat'] text-[16px] sm:text-[18px] font-[400] leading-[24px] text-white/80 text-center px-4">
                Configure voice capabilities and tokenization for your agent
              </span>
            </div>

            <div className="flex w-full max-w-[768px] flex-col gap-4 sm:gap-6">
              {/* Voice Settings */}
              <div className="flex w-full flex-col gap-6 rounded-[20px] border border-amber-800/30 bg-neutral-700/50 px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-neutral-600">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-['Montserrat'] text-[20px] font-[700] text-white">
                    Voice Configuration
                  </span>
                </div>
                
                <div className="flex w-full flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-['Montserrat'] text-[16px] font-[500] text-white">
                      Enable Voice Interaction
                    </span>
                    <Switch
                      checked={agentData.voiceEnabled}
                      onCheckedChange={(checked) => setAgentData({...agentData, voiceEnabled: checked})}
                    />
                  </div>

                  {agentData.voiceEnabled && (
                    <div className="flex w-full flex-col gap-3">
                      <span className="font-['Montserrat'] text-[14px] font-[600] text-white">
                        Voice Type
                      </span>
                      <select
                        value={agentData.voiceType}
                        onChange={(e) => setAgentData({...agentData, voiceType: e.target.value})}
                        className="w-full px-4 py-3 font-['Montserrat'] text-[14px] bg-neutral-600 border border-neutral-500 rounded-[12px] text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                      >
                        <option value="female">Female Voice</option>
                        <option value="male">Male Voice</option>
                        <option value="neutral">Neutral Voice</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Token Settings */}
              <div className="flex w-full flex-col gap-6 rounded-[20px] border border-amber-800/30 bg-neutral-700/50 px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-neutral-600">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-['Montserrat'] text-[20px] font-[700] text-white">
                    Token Generation
                  </span>
                </div>
                
                <div className="flex w-full flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-['Montserrat'] text-[16px] font-[500] text-white">
                      Generate Agent Token
                    </span>
                    <Switch
                      checked={agentData.generateToken}
                      onCheckedChange={(checked) => setAgentData({...agentData, generateToken: checked})}
                    />
                  </div>

                  {agentData.generateToken && (
                    <div className="flex w-full flex-col sm:flex-row gap-4">
                      <div className="flex flex-1 flex-col gap-3">
                        <span className="font-['Montserrat'] text-[14px] font-[600] text-white">
                          Token Name
                        </span>
                        <input
                          type="text"
                          value={agentData.tokenName}
                          onChange={(e) => setAgentData({...agentData, tokenName: e.target.value})}
                          placeholder="Agent Token"
                          className="w-full px-4 py-3 font-['Montserrat'] text-[14px] bg-neutral-600 border border-neutral-500 rounded-[12px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-600"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-3">
                        <span className="font-['Montserrat'] text-[14px] font-[600] text-white">
                          Token Symbol
                        </span>
                        <input
                          type="text"
                          value={agentData.tokenSymbol}
                          onChange={(e) => setAgentData({...agentData, tokenSymbol: e.target.value.toUpperCase()})}
                          placeholder="AGT"
                          className="w-full px-4 py-3 font-['Montserrat'] text-[14px] bg-neutral-600 border border-neutral-500 rounded-[12px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex w-full max-w-[768px] flex-col items-center justify-center gap-4 sm:gap-6">
              <span className="w-full font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[1.1] text-white text-center">
                Review & Deploy
              </span>
              <span className="max-w-[576px] font-['Montserrat'] text-[16px] sm:text-[18px] font-[400] leading-[24px] text-white/80 text-center px-4">
                Review your agent configuration before deploying to the blockchain
              </span>
            </div>

            <div className="flex w-full max-w-[768px] flex-col gap-4 sm:gap-6">
              <div className="flex w-full flex-col gap-6 rounded-[20px] border border-amber-800/30 bg-neutral-700 px-6 py-6">
                <div className="flex items-center gap-4">
                  {selectedAgentType && (
                    <div className={`w-16 h-16 ${selectedAgentType.color} rounded-[16px] flex items-center justify-center`}>
                      <selectedAgentType.icon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="font-['Montserrat'] text-[24px] font-[700] text-white">
                      {agentData.name || 'Unnamed Agent'}
                    </span>
                    <span className="font-['Montserrat'] text-[16px] font-[500] text-white/60">
                      {selectedAgentType?.title}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                      Description
                    </span>
                    <span className="font-['Montserrat'] text-[14px] font-[400] text-white/80 leading-[20px]">
                      {agentData.description || 'No description provided'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                      Personality
                    </span>
                    <span className="font-['Montserrat'] text-[14px] font-[400] text-white/80 leading-[20px]">
                      {agentData.personality || 'No personality defined'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                      Voice Enabled
                    </span>
                    <span className="font-['Montserrat'] text-[14px] font-[400] text-white/80 leading-[20px]">
                      {agentData.voiceEnabled ? `Yes (${agentData.voiceType})` : 'No'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-['Montserrat'] text-[16px] font-[600] text-white">
                      Token Generation
                    </span>
                    <span className="font-['Montserrat'] text-[14px] font-[400] text-white/80 leading-[20px]">
                      {agentData.generateToken ? `${agentData.tokenName} (${agentData.tokenSymbol})` : 'No token'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-neutral-600 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-['Montserrat'] text-[20px] font-[700] text-white">
                      Deployment Cost
                    </span>
                    <span className="font-['Montserrat'] text-[28px] font-[900] text-white">
                      1,000 ALGO
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success-400" />
                      <span className="font-['Montserrat'] text-[14px] font-[500] text-white/80">
                        Agent creation and deployment
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success-400" />
                      <span className="font-['Montserrat'] text-[14px] font-[500] text-white/80">
                        Smart contract initialization
                      </span>
                    </div>
                    {agentData.generateToken && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-400" />
                        <span className="font-['Montserrat'] text-[14px] font-[500] text-white/80">
                          Token generation and liquidity pool
                        </span>
                      </div>
                    )}
                    {agentData.voiceEnabled && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-400" />
                        <span className="font-['Montserrat'] text-[14px] font-[500] text-white/80">
                          Voice synthesis setup
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (creationComplete) {
    return (
      <div className="flex w-full min-h-full flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 sm:gap-6"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-success-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="font-['Montserrat'] text-[32px] sm:text-[40px] lg:text-[48px] font-[900] leading-[1.1] text-white text-center px-4">
              Agent Created Successfully!
            </span>
            <span className="font-['Montserrat'] text-[16px] sm:text-[18px] lg:text-[20px] font-[500] text-white/80 text-center px-4">
              Your AI agent is now live on the Algorand blockchain
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Button
              size="large"
              onClick={() => setCurrentView('agents')}
              className="w-full sm:w-auto"
            >
              View Agent
            </Button>
            <Button
              variant="brand-secondary"
              size="large"
              onClick={resetCreateAgent}
              className="w-full sm:w-auto"
            >
              Create Another
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
          <span className="font-['Montserrat'] text-[14px] sm:text-[16px] font-[500] text-white/60">
            Step {currentStep} of 4
          </span>
        </div>
        <div className="w-full max-w-[1024px] bg-neutral-600 rounded-full h-2">
          <div 
            className="bg-brand-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 bg-brand-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderCreateAgentStep()}
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
            disabled={currentStep === 1}
            icon={<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {currentStep === 4 ? (
            <Button
              size={window.innerWidth < 640 ? "medium" : "large"}
              onClick={handleCreateAgent}
              disabled={isCreating || !selectedType || !agentData.name}
              icon={isCreating ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">{isCreating ? 'Creating Agent...' : 'Deploy Agent'}</span>
              <span className="sm:hidden">{isCreating ? 'Creating...' : 'Deploy'}</span>
            </Button>
          ) : (
            <Button
              size={window.innerWidth < 640 ? "medium" : "large"}
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedType}
              iconRight={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
              className="flex-shrink-0"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAgentSection; 