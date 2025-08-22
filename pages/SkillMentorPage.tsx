import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '../components/Icon.js';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';
import { useAI } from '../hooks/useAI.js';
import MarkdownRenderer from '../components/MarkdownRenderer.js';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingChunks?: any[];
}

const SkillMentorPage: React.FC = () => {
  const { skillName } = useParams<{ skillName: string }>();
  const decodedSkillName = decodeURIComponent(skillName || '');

  const { t } = useAppContext();
  const play = useSounds();
  const { generateContent, canUseAI } = useAI();

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canUseAI) {
      setHistory([{ 
        id: crypto.randomUUID(), 
        role: 'model', 
        text: t('skill_mentor.welcome', { skill: decodedSkillName }) 
      }]);
    }
  }, [canUseAI, decodedSkillName, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleSendMessage = async (messageText: string, isPredefined: boolean = false) => {
    if (!messageText.trim() || isLoading) return;

    play('click');
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: messageText };
    const historyForAPI = isPredefined ? history : [...history, userMessage];
    
    if (!isPredefined) {
        setHistory(historyForAPI);
        setInput('');
    }

    setIsLoading(true);
    setError(null);

    try {
      const systemInstruction = t('skill_mentor.system_prompt', { skill: decodedSkillName });
      
      const response = await generateContent({
        model: 'gemini-2.5-flash',
        contents: historyForAPI.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })),
        config: { systemInstruction }
      });

      const modelMessage: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: response.text };
      setHistory(prev => [...prev, modelMessage]);

    } catch (e) {
      console.error("Skill Mentor Error:", e);
      play('error');
      const errorMessage = (e as Error).message || t('coach.connection_failed');
      const errorResponse: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: errorMessage };
      setHistory(prev => [...prev, errorResponse]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredefinedAction = async (promptKey: string, thinkingMessageKey: string, tool?: any) => {
    if (isLoading) return;
    play('click');
    
    const prompt = t(promptKey, { skill: decodedSkillName });
    const thinkingMessage: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: t(thinkingMessageKey) };
    setHistory(prev => [...prev, thinkingMessage]);

    setIsLoading(true);
    setError(null);
    
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                ...(tool && { tools: [tool] })
            }
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const modelMessage: ChatMessage = { 
            id: crypto.randomUUID(), 
            role: 'model', 
            text: response.text,
            ...(groundingChunks && { groundingChunks })
        };
        // Replace the "thinking" message with the actual response
        setHistory(prev => [...prev.slice(0, -1), modelMessage]);

    } catch (e) {
        console.error("Skill Mentor Predefined Action Error:", e);
        play('error');
        const errorMessage = (e as Error).message || t('skill_mentor.search_error');
        const errorResponse: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: errorMessage };
        setHistory(prev => [...prev.slice(0, -1), errorResponse]);
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }

  if (!canUseAI) {
    return (
      <div className="bg-[var(--surface-danger)] p-6 rounded-none text-center flex flex-col items-center gap-4 border border-[var(--border-danger)]">
        <Icon name="error" className="w-12 h-12 text-[var(--text-danger)]" />
        <h1 className="text-2xl font-bold text-[var(--text-danger)]">{t('coach.ai_core_offline')}</h1>
        <p className="text-[var(--text-danger-muted)]">{t('coach.api_key_required')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-[var(--surface-primary)] rounded-none border border-[var(--border-faded)]">
      <header className="p-4 border-b border-[var(--border-primary)] group">
        <h1 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-3">
          <Icon name="sparkle" className="w-6 h-6 icon-animated" />
          {t('skill_mentor.title', { skill: decodedSkillName })}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-none border border-[var(--border-secondary)] bg-[var(--surface-secondary)] flex items-center justify-center"><Icon name="sparkle" className="w-5 h-5 text-[var(--text-primary)]" /></div>}
            <div className={`max-w-md lg:max-w-2xl p-3 rounded-none shadow-md ${msg.role === 'user' ? 'bg-accent-primary/20 text-[var(--text-secondary)]' : 'bg-[var(--surface-tertiary)] text-[var(--text-primary)]'}`}>
              <MarkdownRenderer content={msg.text} />
              {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--border-primary)]">
                    <h4 className="font-bold text-sm text-[var(--text-muted)] mb-2">{t('skill_mentor.sources')}</h4>
                    <ul className="space-y-2">
                        {msg.groundingChunks.map((chunk: any, index: number) => (
                           <li key={index}>
                                <a href={chunk.web?.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-[var(--accent-primary)] hover:underline">
                                    <Icon name="link" className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{chunk.web?.title || chunk.web?.uri}</span>
                                </a>
                           </li>
                        ))}
                    </ul>
                </div>
              )}
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-none border border-[var(--border-secondary)] bg-[var(--surface-secondary)] flex items-center justify-center"><Icon name="sparkle" className="w-5 h-5 text-[var(--text-primary)]" /></div>
                <div className="max-w-md lg:max-w-lg p-3 rounded-none shadow-md bg-[var(--surface-tertiary)] text-[var(--text-primary)]">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-[var(--border-primary)] space-y-3">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handlePredefinedAction('skill_mentor.path_prompt', 'skill_mentor.path_suggested')}
              className="group w-full flex items-center justify-center gap-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-secondary-text)] font-bold py-3 rounded-none transition-all border border-[var(--border-secondary)] hover:border-[var(--border-accent)]"
              disabled={isLoading}
            >
              <Icon name="git-pull-request" className="w-5 h-5 icon-animated"/>
              <span>{t('skill_mentor.suggest_path')}</span>
            </button>
             <button
              onClick={() => handlePredefinedAction('skill_mentor.resources_prompt', 'skill_mentor.resources_found', {googleSearch: {}})}
              className="group w-full flex items-center justify-center gap-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-secondary-text)] font-bold py-3 rounded-none transition-all border border-[var(--border-secondary)] hover:border-[var(--border-accent)]"
              disabled={isLoading}
            >
              <Icon name="search" className="w-5 h-5 icon-animated"/>
              <span>{t('skill_mentor.find_resources')}</span>
            </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('skill_mentor.placeholder')}
            className="w-full bg-[var(--surface-tertiary)] p-3 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] transition border border-[var(--border-secondary)]"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="group flex-shrink-0 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] text-[var(--accent-primary-text)] font-bold p-3 rounded-none transition-colors flex items-center justify-center border border-[var(--border-accent)] disabled:border-transparent"
            disabled={!input.trim() || isLoading}
            aria-label={t('coach.send_message')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default SkillMentorPage;