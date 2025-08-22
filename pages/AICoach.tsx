import React, { useState, useRef, useEffect } from 'react';
import { Type } from '@google/genai';
import moment from 'moment';
import Icon from '../components/Icon.js';
import { useAppContext } from '../hooks/useAppContext.js';
import AISuggestionsModal from '../components/AISuggestionsModal.js';
import ConfirmationModal from '../components/ConfirmationModal.js';
import { Task, Goal } from '../types.js';
import { useSounds } from '../hooks/useSounds.js';
import AIGoalSuggestionsModal from '../components/AIGoalSuggestionsModal.js';
import { useAI } from '../hooks/useAI.js';
import { usePrevious } from '../hooks/usePrevious.js';


interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const getProductivityAnalysis = (tasks: Task[], t: (key: string, params?: Record<string, string | number>) => any): string => {
    // only look at tasks completed in the last 4 weeks
    const fourWeeksAgo = moment().subtract(4, 'weeks').toISOString();
    const completedTasks = tasks.filter(t => t.completed && t.completedAt && t.completedAt > fourWeeksAgo);
    
    if (completedTasks.length < 10) {
        return t('coach.productivity_analysis_not_enough_data');
    }

    const completionsByHour: { [hour: number]: number } = {};
    for (let i = 0; i < 24; i++) {
        completionsByHour[i] = 0;
    }

    completedTasks.forEach(task => {
        const completionHour = new Date(task.completedAt!).getHours();
        completionsByHour[completionHour]++;
    });
    
    const sortedHours = Object.entries(completionsByHour)
        .sort(([, a], [, b]) => b - a)
        .filter(([, count]) => count > 0);
    
    if (sortedHours.length === 0) {
        return t('coach.productivity_analysis_no_pattern');
    }
    
    let analysis = t('coach.productivity_analysis_header') + "\n";
    sortedHours.slice(0, 3).forEach(([hourStr, count]) => {
        const hour = parseInt(hourStr, 10);
        analysis += t('coach.productivity_analysis_entry', { hour, count }) + "\n";
    });
    analysis += t('coach.productivity_analysis_footer');
    
    return analysis;
};


const AICoach: React.FC = () => {
  const { state, dispatch, t, language } = useAppContext();
  const play = useSounds();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateContent, canUseAI, generateContentStream } = useAI();
  const prevLanguage = usePrevious(language);

  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  
  const [isJournalConfirmOpen, setIsJournalConfirmOpen] = useState(false);

  // New state for goal suggestions
  const [isGoalSuggestConfirmOpen, setIsGoalSuggestConfirmOpen] = useState(false);
  const [isGoalSuggestionModalOpen, setIsGoalSuggestionModalOpen] = useState(false);
  const [isSuggestingGoals, setIsSuggestingGoals] = useState(false);
  const [suggestedGoals, setSuggestedGoals] = useState<Goal[]>([]);
  const [goalSuggestionError, setGoalSuggestionError] = useState<string | null>(null);

  // Effect for initial chat setup
  useEffect(() => {
    if (!canUseAI) {
      setHistory([]);
      return;
    }
    
    // Only set initial messages if history is empty and translations are ready
    if (history.length === 0 && t) {
        const today = new Date().toISOString().slice(0, 10);
        const hasBeenBriefedToday = state.lastAiBriefingDate === today;
        const initialWelcome = { id: crypto.randomUUID(), role: 'model' as const, text: t('coach.welcome') };

        if (hasBeenBriefedToday) {
            setHistory([initialWelcome]);
        } else {
            const isTaskForToday = (task: Task) => {
                if (task.dueDate) return task.dueDate === today;
                return new Date(task.createdAt).toISOString().slice(0, 10) === today;
            };

            const priorityOrder = { high: 0, medium: 1, low: 2 };
            const todayTasks = state.tasks.filter(task => !task.completed && isTaskForToday(task));
            const highestPriorityTask = todayTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])[0];

            let briefingMessageText: string;
            if (highestPriorityTask) {
                briefingMessageText = t('coach.daily_briefing_task', { task: highestPriorityTask.text });
            } else {
                briefingMessageText = t('coach.daily_briefing_no_task');
            }
            
            const briefingMessage = { id: crypto.randomUUID(), role: 'model' as const, text: briefingMessageText };
            
            setHistory([initialWelcome, briefingMessage]);
            dispatch({ type: 'SET_AI_BRIEFING_DATE', payload: { date: today } });
        }
    }
  }, [canUseAI, history.length, t, dispatch, state.lastAiBriefingDate, state.tasks]);
  
  // Effect for handling language change to reset the chat
  useEffect(() => {
    if (prevLanguage !== undefined && prevLanguage !== language) {
        if (canUseAI) {
            const initialWelcome = { id: crypto.randomUUID(), role: 'model' as const, text: t('coach.welcome') };
            const resetMessage = { id: crypto.randomUUID(), role: 'model' as const, text: t('coach.session_reset') };
            setHistory([initialWelcome, resetMessage]);
        } else {
            setHistory([]);
        }
    }
  }, [language, prevLanguage, canUseAI, t]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    play('click');
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: input };
    const historyForAPI = [...history, userMessage];
    setHistory(historyForAPI);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);
    
    const modelMessageId = crypto.randomUUID();
    setHistory(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

    try {
      const coachSystemInstruction = t('coach.system_prompt', { language: language });
      
      const productivityAnalysis = getProductivityAnalysis(state.tasks, t);
      const augmentedSystemInstruction = `${coachSystemInstruction}\n\n${t('coach.productivity_analysis_title')}\n${productivityAnalysis}`;
      
      const stream = await generateContentStream({
          model: 'gemini-2.5-flash',
          contents: historyForAPI.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })),
          config: { systemInstruction: augmentedSystemInstruction }
      });
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setHistory(prev => 
            prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, text: msg.text + chunkText } : msg
            )
        );
      }
    } catch (e) {
      console.error("AI Coach Stream Error:", e);
      play('error');
      const errorMessage = (e as Error).message || t('coach.connection_failed');
      setHistory(prev => 
        prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, text: errorMessage } : msg
        )
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestTasks = async () => {
    if (isSuggesting) return;

    play('click');
    setIsSuggestionModalOpen(true);
    setIsSuggesting(true);
    setSuggestionError(null);
    setSuggestedTasks([]);

    try {
      const prompt = t('coach.suggest_tasks_prompt', { language: language });
      
      const response = await generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tasks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["tasks"],
          },
        },
      });
      
      const responseJson = JSON.parse(response.text);

      if (responseJson && responseJson.tasks && Array.isArray(responseJson.tasks)) {
        setSuggestedTasks(responseJson.tasks);
      } else {
        throw new Error(t('ai_modal.invalid_response'));
      }
    } catch (e) {
      console.error("Error suggesting tasks:", e);
      play('error');
      setSuggestionError((e as Error).message || t('ai_modal.suggestion_error'));
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddSuggestedTasks = (tasks: string[]) => {
    play('add');
    dispatch({ type: 'ADD_AI_TASKS', payload: { tasks } });
    setIsSuggestionModalOpen(false);
    setHistory(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: t('coach.new_directives_added') }]);
  };

  const handleAnalyzeJournal = async () => {
    if (isLoading || state.journalEntries.length === 0) return;

    play('click');
    setIsJournalConfirmOpen(false);
    setIsLoading(true);
    setError(null);

    try {
      const recentEntries = state.journalEntries
        .slice(0, 20)
        .map(entry => `Date: ${new Date(entry.createdAt).toLocaleDateString(language)}\n${entry.text}`)
        .join('\n---\n');

      const prompt = t('coach.analyze_journal_prompt', { recentEntries, language });
      
      const response = await generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      setHistory(prev => [...prev, {id: crypto.randomUUID(), role: 'model', text: response.text}]);

    } catch (e) {
      console.error("Error analyzing journal:", e);
      play('error');
      const errorMessage = (e as Error).message || t('coach.log_analysis_error');
      setHistory(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: errorMessage }]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestGoals = async () => {
    if (isSuggestingGoals || state.journalEntries.length < 3) return;
    
    play('click');
    setIsGoalSuggestConfirmOpen(false);
    setIsGoalSuggestionModalOpen(true);
    setIsSuggestingGoals(true);
    setGoalSuggestionError(null);
    setSuggestedGoals([]);

    try {
        const recentEntries = state.journalEntries
            .slice(0, 20)
            .map(entry => `Date: ${new Date(entry.createdAt).toLocaleDateString(language)}\n${entry.text}`)
            .join('\n---\n');

        const prompt = t('coach.ai_goal_prompt', {
            journalEntries: recentEntries,
            today: moment().format('YYYY-MM-DD'),
            language: language
        });

        const response = await generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    deadline: { type: Type.STRING },
                                    dailyTaskDescription: { type: Type.STRING },
                                },
                                required: ["name", "deadline", "dailyTaskDescription"]
                            }
                        }
                    },
                    required: ["suggestions"]
                }
            }
        });

        const result = JSON.parse(response.text);
        if (result && Array.isArray(result.suggestions)) {
            // Add other required Goal properties
            const fullGoals: Goal[] = result.suggestions.map((g: any) => ({
                id: crypto.randomUUID(),
                ...g,
                createdAt: new Date().toISOString(),
                isActive: true
            }));
            setSuggestedGoals(fullGoals);
        } else {
            throw new Error(t('ai_modal.invalid_response'));
        }

    } catch (e) {
        console.error("Error suggesting goals:", e);
        play('error');
        setGoalSuggestionError((e as Error).message || t('ai_goal_modal.error'));
    } finally {
        setIsSuggestingGoals(false);
    }
  };
  
  const handleAddGoal = (goal: Goal) => {
    play('add');
    dispatch({
        type: 'ADD_GOAL',
        payload: {
            name: goal.name,
            deadline: goal.deadline,
            dailyTaskDescription: goal.dailyTaskDescription,
        }
    });
    setIsGoalSuggestionModalOpen(false);
    setHistory(prev => [...prev, {id: crypto.randomUUID(), role: 'model', text: t('coach.new_objective_initiated', { name: goal.name })}]);
  };


  if (!canUseAI) {
    return (
      <div className="bg-[var(--surface-danger)] p-6 rounded-none text-center flex flex-col items-center gap-4 border border-[var(--border-danger)]">
        <Icon name="error" className="w-12 h-12 text-[var(--text-danger)]" />
        <h1 className="text-2xl font-bold text-[var(--text-danger)]">{t('coach.ai_core_offline')}</h1>
        <p className="text-[var(--text-danger-muted)]">
          {t('coach.api_key_required')}
        </p>
      </div>
    );
  }

  const allButtonsDisabled = isLoading || isSuggesting || isSuggestingGoals;

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-12rem)] bg-[var(--surface-primary)] rounded-none border border-[var(--border-faded)]">
        <header className="p-4 border-b border-[var(--border-primary)] group">
          <h1 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-3">
            <Icon name="sparkle" className="w-6 h-6 icon-animated" />
            {t('coach.title')}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.map((msg, index) => {
            const isLastMessage = index === history.length - 1;
            const isStreaming = isLoading && isLastMessage && msg.role === 'model';
            return (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-none border border-[var(--border-secondary)] bg-[var(--surface-secondary)] flex items-center justify-center"><Icon name="sparkle" className="w-5 h-5 text-[var(--text-primary)]" /></div>}
                <div className={`max-w-md lg:max-w-lg p-3 rounded-none shadow-md ${msg.role === 'user' ? 'bg-accent-primary/20 text-[var(--text-secondary)]' : 'bg-[var(--surface-tertiary)] text-[var(--text-primary)]'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}{isStreaming && <span className="blinking-cursor">&nbsp;</span>}</p>
                </div>
              </div>
            );
          })}
          {error && !isLoading && <p className="text-center text-[var(--text-danger)]">{error}</p>}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-[var(--border-primary)] space-y-3">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleSuggestTasks}
                className="group w-full flex items-center justify-center gap-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-secondary-text)] font-bold py-3 rounded-none transition-all border border-[var(--border-secondary)] hover:border-[var(--border-accent)]"
                disabled={allButtonsDisabled}
              >
                {isSuggesting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                ) : (
                  <Icon name="sparkle" className="w-5 h-5 icon-animated"/>
                )}
                <span>{t('coach.generate_directives')}</span>
              </button>
              <button
                onClick={() => {
                    play('click');
                    setIsGoalSuggestConfirmOpen(true);
                }}
                className="group w-full flex items-center justify-center gap-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-secondary-text)] font-bold py-3 rounded-none transition-all border border-[var(--border-secondary)] hover:border-[var(--border-accent)]"
                disabled={allButtonsDisabled || state.journalEntries.length < 3}
                title={state.journalEntries.length < 3 ? t('coach.journal_empty_tooltip') : t('coach.suggest_objectives')}
              >
                {isSuggestingGoals ? (
                   <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                ) : (
                  <Icon name="goal" className="w-5 h-5 icon-animated"/>
                )}
                <span>{t('coach.suggest_objectives')}</span>
              </button>
               <button
                onClick={() => {
                    play('click');
                    setIsJournalConfirmOpen(true);
                }}
                className="group w-full flex items-center justify-center gap-2 bg-[var(--surface-danger)]/50 hover:bg-[var(--surface-danger)]/70 disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--text-danger)] font-bold py-3 rounded-none transition-all border border-[var(--border-danger)]"
                disabled={allButtonsDisabled || state.journalEntries.length === 0}
                title={state.journalEntries.length === 0 ? t('coach.journal_empty_tooltip') : t('coach.analyze_logs')}
              >
                <Icon name="journal" className="w-5 h-5 icon-animated"/>
                <span>{t('coach.analyze_logs')}</span>
              </button>
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('coach.placeholder')}
              className="w-full bg-[var(--surface-tertiary)] p-3 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] transition border border-[var(--border-secondary)]"
              disabled={allButtonsDisabled}
            />
            <button
              type="submit"
              className="group flex-shrink-0 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] text-[var(--accent-primary-text)] font-bold p-3 rounded-none transition-colors flex items-center justify-center border border-[var(--border-accent)] disabled:border-transparent"
              disabled={!input.trim() || allButtonsDisabled}
              aria-label={t('coach.send_message')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </form>
        </footer>
      </div>
      <AISuggestionsModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        suggestions={suggestedTasks}
        onAddTasks={handleAddSuggestedTasks}
        isLoading={isSuggesting}
        error={suggestionError}
      />
       <ConfirmationModal
        isOpen={isJournalConfirmOpen}
        onClose={() => setIsJournalConfirmOpen(false)}
        onConfirm={handleAnalyzeJournal}
        title={t('coach.analyze_logs_confirm_title')}
        message={t('coach.analyze_logs_confirm_message')}
        confirmText={t('coach.analyze_logs_confirm_cta')}
        />
        <ConfirmationModal
            isOpen={isGoalSuggestConfirmOpen}
            onClose={() => setIsGoalSuggestConfirmOpen(false)}
            onConfirm={handleSuggestGoals}
            title={t('coach.suggest_objectives_confirm_title')}
            message={t('coach.suggest_objectives_confirm_message')}
            confirmText={t('coach.suggest_objectives_confirm_cta')}
        />
        <AIGoalSuggestionsModal
            isOpen={isGoalSuggestionModalOpen}
            onClose={() => setIsGoalSuggestionModalOpen(false)}
            isLoading={isSuggestingGoals}
            error={goalSuggestionError}
            suggestions={suggestedGoals}
            onAddGoal={handleAddGoal}
        />
    </>
  );
};

export default AICoach;
