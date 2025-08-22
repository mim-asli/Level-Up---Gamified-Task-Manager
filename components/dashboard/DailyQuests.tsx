import React, { useState, useEffect, memo } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { generateDailyQuests } from '../../lib/quests.js';
import { useAI } from '../../hooks/useAI.js';
import Icon from '../Icon.js';
import QuestItem from './QuestItem.js';

const DailyQuests: React.FC = () => {
    const { state, dispatch, t, language } = useAppContext();
    const { generateContent, canUseAI } = useAI();
    const [isLoading, setIsLoading] = useState(false);
    const hasFetched = React.useRef(false);

    useEffect(() => {
        const fetchQuests = async () => {
            const today = new Date().toISOString().slice(0, 10);
            if (state.dailyQuests.date === today && state.dailyQuests.quests.length === 0 && !isLoading && !hasFetched.current) {
                
                if (canUseAI) {
                    setIsLoading(true);
                    hasFetched.current = true;
                    try {
                        const newQuests = await generateDailyQuests(state.tasks, generateContent, language, t);
                        dispatch({ type: 'SET_DAILY_QUESTS', payload: { quests: newQuests } });
                    } catch (e) {
                        console.error("Failed to generate AI quests.", e);
                    } finally {
                        setIsLoading(false);
                    }
                }
            } else if (state.dailyQuests.date !== today) {
                hasFetched.current = false;
            }
        };

        fetchQuests();
    }, [state.dailyQuests.date, state.tasks, canUseAI, isLoading, language, dispatch, generateContent, t]);

    const { quests } = state.dailyQuests;

    if (!canUseAI) {
        return null; // Don't show the quest component if AI is disabled
    }

    return (
        <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
             <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2 mb-4 group">
                <Icon name="calendar" className="w-6 h-6 icon-animated" />
                <span>{t('dashboard.daily_directives')}</span>
            </h2>
            {isLoading ? (
                <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-current"></div>
                    <span>{t('command_center.loading_directives')}</span>
                 </div>
            ) : quests.length > 0 ? (
                <div className="space-y-3">
                    {quests.map(quest => (
                        <QuestItem key={quest.id} quest={quest} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-[var(--text-muted)] py-4">{t('command_center.no_directives')}</p>
            )}
        </div>
    );
};

export default memo(DailyQuests);