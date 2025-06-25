import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';

export const useChat = (characterId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const sendMessage = useCallback(async (content: string, isVoice = false) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      characterId,
      content,
      timestamp: new Date().toISOString(),
      isUser: true,
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting perspective! Let me think about that...",
        "I see what you mean. From my experience in the digital realm...",
        "Fascinating! That reminds me of a strategy I once used...",
        "You know, there's something about that approach that intrigues me...",
        "Ha! You're quite the conversationalist. Here's what I think..."
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        characterId,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        isUser: false,
        audioUrl: isVoice ? 'mock-audio-url.mp3' : undefined
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  }, [characterId]);

  const startVoiceRecording = useCallback(() => {
    setIsRecording(true);
    // Implement voice recording logic
  }, []);

  const stopVoiceRecording = useCallback(() => {
    setIsRecording(false);
    // Process recorded audio and send as message
    sendMessage("Voice message transcribed", true);
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isTyping,
    isRecording,
    sendMessage,
    startVoiceRecording,
    stopVoiceRecording,
    clearMessages
  };
};