import { useCallback } from 'react';
import { useAppContext } from './useAppContext.js';
import { aiGenerateContent, aiGenerateContentStream } from '../lib/aiService.js';
import { GenerateContentParameters, GenerateContentResponse } from '@google/genai';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const useAI = () => {
  const { getNextApiKeyAndRotate, state } = useAppContext();
  const { localAIConfig, apiKeys, language } = state;

  const hasGemini = apiKeys.some(k => k.isEnabled);
  const canUseAI = hasGemini || localAIConfig.enabled;

  const generateContent = useCallback(async (params: GenerateContentParameters): Promise<GenerateContentResponse> => {
    if (!canUseAI) {
      throw new Error("No AI provider configured. Please add a Gemini key or set up a local AI endpoint in Settings.");
    }
    const geminiApiKey = hasGemini ? getNextApiKeyAndRotate() : null;
    return aiGenerateContent({ geminiApiKey, localAI: localAIConfig }, params, language);
  }, [getNextApiKeyAndRotate, localAIConfig, canUseAI, hasGemini, language]);

  const generateContentStream = useCallback(async (params: GenerateContentParameters): Promise<AsyncGenerator<GenerateContentResponse>> => {
    if (!hasGemini) {
        throw new Error("Streaming is only supported with a configured Gemini API key.");
    }
    const geminiApiKey = getNextApiKeyAndRotate();
    return aiGenerateContentStream({ geminiApiKey, localAI: localAIConfig }, params, language);
  }, [getNextApiKeyAndRotate, localAIConfig, hasGemini, language]);

  const sendMessage = useCallback(async (history: ChatMessage[], newMessage: string, systemInstruction?: string): Promise<string> => {
    if (!canUseAI) {
      throw new Error("No AI provider configured.");
    }
    const geminiApiKey = hasGemini ? getNextApiKeyAndRotate() : null;
    
    // Convert history to Gemini format, which is an array of Content objects
    const contents = [...history, { role: 'user', text: newMessage }].map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    const params: GenerateContentParameters = {
        model: 'gemini-2.5-flash',
        contents,
        ...(systemInstruction && { config: { systemInstruction } })
    };

    const response = await aiGenerateContent({ geminiApiKey, localAI: localAIConfig }, params, language);
    return response.text;
  }, [getNextApiKeyAndRotate, localAIConfig, canUseAI, hasGemini, language]);

  return { generateContent, sendMessage, generateContentStream, canUseAI };
};