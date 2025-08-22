import React, { useState, useEffect, useRef } from 'react';
import { Type } from '@google/genai';
import moment from 'moment';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from './Icon.js';
import { useSounds } from '../hooks/useSounds.js';
import { useAI } from '../hooks/useAI.js';
import { useModalKeyControls } from '../hooks/useModalKeyControls.js';

interface GoalOracleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

type GoalCreationStep = 'name' | 'deadline' | 'daily_task' | 'confirm' | 'done';

interface GoalData {
    name: string;
    deadline: string;
    dailyTaskDescription: string;
}

const GoalOracleModal: React.FC<GoalOracleModalProps> = ({ isOpen, onClose }) => {
    const { t, dispatch, language } = useAppContext();
    const play = useSounds();
    const { generateContent, sendMessage: sendAIMessage, canUseAI } = useAI();

    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<GoalCreationStep>('name');
    const [goalData, setGoalData] = useState<Partial<GoalData>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useModalKeyControls(isOpen, onClose);

    const initialize = () => {
        setHistory([{ role: 'model', text: t('oracle.welcome') }]);
        setStep('name');
        setGoalData({});
        setInput('');
    };
    
    useEffect(() => {
        if (isOpen && canUseAI) {
            initialize();
        }
    }, [isOpen, t, language, canUseAI]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading || step === 'done' || step === 'confirm') return;

        play('click');
        const userMessage: ChatMessage = { role: 'user', text: input };
        setHistory(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Store data based on step
            const newGoalData = { ...goalData, [step]: currentInput };
            setGoalData(newGoalData);

            if (step === 'daily_task') {
                // Final step, switch to JSON mode for reliable data extraction
                const finalPrompt = t('oracle.final_prompt', {
                    name: newGoalData.name!,
                    deadline: newGoalData.deadline!,
                    dailyTask: currentInput,
                    today: moment().format('YYYY-MM-DD')
                });

                const response = await generateContent({
                    model: "gemini-2.5-flash",
                    contents: finalPrompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                deadline: { type: Type.STRING },
                                dailyTaskDescription: { type: Type.STRING },
                                summary: { type: Type.STRING },
                            },
                            required: ["name", "deadline", "dailyTaskDescription", "summary"]
                        }
                    }
                });
                
                const result = JSON.parse(response.text);
                setGoalData(result);
                setHistory(prev => [...prev, { role: 'model', text: result.summary }]);
                setStep('confirm');

            } else {
                 const aiHistory = [...history, userMessage];
                 const responseText = await sendAIMessage(aiHistory, currentInput, t('oracle.system_prompt'));
                 setHistory(prev => [...prev, {role: 'model', text: responseText}]);
                 const nextStep: GoalCreationStep = step === 'name' ? 'deadline' : 'daily_task';
                 setStep(nextStep);
            }
        } catch (err) {
            console.error(err);
            setHistory(prev => [...prev, { role: 'model', text: (err as Error).message || t('oracle.error') }]);
            setStep('done');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleConfirmGoal = () => {
        if(goalData.name && goalData.deadline && goalData.dailyTaskDescription) {
            play('achievement');
            dispatch({ type: 'ADD_GOAL', payload: goalData as GoalData });
            setHistory(prev => [...prev, {role: 'model', text: t('oracle.success')}]);
            setStep('done');
            setTimeout(onClose, 3000);
        }
    };

    if (!isOpen) return null;

    if (!canUseAI) {
         return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
                <div className="bg-[var(--surface-danger)] p-6 rounded-none text-center flex flex-col items-center gap-4 border border-[var(--border-danger)] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                    <Icon name="error" className="w-12 h-12 text-[var(--text-danger)]" />
                    <h2 className="text-2xl font-bold text-[var(--text-danger)]">{t('coach.ai_core_offline')}</h2>
                    <p className="text-[var(--text-danger-muted)]">{t('coach.api_key_required')}</p>
                    <button onClick={onClose} className="mt-4 px-5 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors">{t('close')}</button>
                </div>
            </div>
        );
    }

    const renderFooter = () => {
        if (step === 'confirm') {
            return (
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={onClose} className="w-full sm:w-auto flex-1 px-5 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors">{t('cancel')}</button>
                    <button onClick={handleConfirmGoal} className="w-full sm:w-auto flex-1 px-5 py-2 rounded-none bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold transition-all border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]">
                        {t('oracle.confirm_protocol')}
                    </button>
                </div>
            );
        }
        if (step === 'done') return null;

        return (
            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('oracle.placeholder')}
                    className="w-full bg-[var(--surface-tertiary)] p-3 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] transition border border-[var(--border-secondary)]"
                    disabled={isLoading}
                    aria-label={t('oracle.placeholder')}
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
        )
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex flex-col p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="goal-oracle-title">
            <div className="w-full max-w-3xl mx-auto flex flex-col h-full bg-[var(--surface-primary)] rounded-none border border-[var(--border-accent)] shadow-[0_0_20px_var(--shadow-accent)]" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-[var(--border-primary)] group flex justify-between items-center">
                    <h2 id="goal-oracle-title" className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-3">
                        <Icon name="sparkle" className="w-6 h-6 icon-animated" />
                        {t('goals.initiate_objective_protocol')}
                    </h2>
                    <button onClick={onClose} className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] text-3xl leading-none transition-transform hover:rotate-90" aria-label={t('close')}>&times;</button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 space-y-4">
                     {history.map((msg, index) => (
                          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-none border border-[var(--border-secondary)] bg-[var(--surface-secondary)] flex items-center justify-center"><Icon name="sparkle" className="w-5 h-5 text-[var(--text-primary)]" /></div>}
                            <div className={`max-w-md lg:max-w-lg p-3 rounded-none shadow-md ${msg.role === 'user' ? 'bg-accent-primary/20 text-[var(--text-secondary)]' : 'bg-[var(--surface-tertiary)] text-[var(--text-primary)]'}`}>
                              <p className="whitespace-pre-wrap">{msg.text}</p>
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

                <footer className="p-4 border-t border-[var(--border-primary)]">
                    {renderFooter()}
                </footer>
            </div>
        </div>
    );
};

export default GoalOracleModal;