import React, { useState, useEffect } from 'react';
import moment, { type Moment } from 'moment';
import jmoment from 'jalali-moment';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from './Icon.js';
import MarkdownRenderer from './MarkdownRenderer.js';
import { useAI } from '../hooks/useAI.js';
import { useModalKeyControls } from '../hooks/useModalKeyControls.js';

interface WeeklyReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch, t, language } = useAppContext();
    const { generateContent, canUseAI } = useAI();
    const [reviewContent, setReviewContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useModalKeyControls(isOpen, onClose);
    
    const getMoment = (date?: moment.MomentInput): Moment => {
        const input = moment.isMoment(date) ? (date as moment.Moment).toDate() : date;
        return (language === 'fa' ? jmoment(input) : moment(input)) as any;
    };

    useEffect(() => {
        if (isOpen && !reviewContent && !isLoading && canUseAI) {
            generateReview();
        }
    }, [isOpen, canUseAI]);

    const generateReview = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const oneWeekAgo: Moment = getMoment().subtract({ days: 7 });
            const tasksLastWeek = state.tasks.filter(t => getMoment(t.createdAt).isAfter(oneWeekAgo));
            const completedTasks = tasksLastWeek.filter(t => t.completed);
            const xpLastWeek = completedTasks.reduce((sum, task) => sum + task.xp, 0);

            let topGoalName = t('review.ai_prompt_data_na');
            const goalCounts: Record<string, number> = {};
            completedTasks.forEach(task => {
                if(task.goalId) {
                    goalCounts[task.goalId] = (goalCounts[task.goalId] || 0) + 1;
                }
            });
            const topGoalId = Object.keys(goalCounts).sort((a,b) => goalCounts[b] - goalCounts[a])[0];
            if(topGoalId) {
                const goal = state.goals.find(g => g.id === topGoalId);
                if(goal) topGoalName = goal.name;
            }
            
            const pomodoroSessions = state.pomodoro.lastSessionDate && getMoment(state.pomodoro.lastSessionDate).isAfter(oneWeekAgo) ? state.pomodoro.sessions : 0;
            const pomodoroInfo = pomodoroSessions > 0 ? pomodoroSessions : t('review.ai_prompt_data_pomodoro_tip');

            const prompt = `
            ${t('review.ai_prompt_intro')}

            ${t('review.ai_prompt_data_title')}
            - ${t('review.ai_prompt_data_tasks')}: ${completedTasks.length}
            - ${t('review.ai_prompt_data_xp')}: ${xpLastWeek}
            - ${t('review.ai_prompt_data_goal')}: ${topGoalName}
            - ${t('review.ai_prompt_data_streak')}: ${state.dailyStreak.current}
            - ${t('review.ai_prompt_data_pomodoro')}: ${pomodoroInfo}
            - ${t('review.ai_prompt_data_journal')}: ${state.journalEntries.filter(j => getMoment(j.createdAt).isAfter(oneWeekAgo)).length}
            
            Start your report with a catchy title like "**${t('review.ai_prompt_title')}**".
            `;
            
            const response = await generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setReviewContent(response.text);
            dispatch({ type: 'SET_LAST_WEEKLY_REVIEW_DATE', payload: { date: new Date().toISOString().slice(0, 10) } });

        } catch (e) {
            console.error("Error generating weekly review:", e);
            setError((e as Error).message || t('review.error'));
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
                    <p className="mt-4 text-[var(--text-secondary)]">{t('review.loading')}</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Icon name="error" className="w-12 h-12 text-[var(--text-danger)] mb-4" />
                    <p className="text-[var(--text-danger)]">{error}</p>
                </div>
            );
        }
        if (reviewContent) {
            return <MarkdownRenderer content={reviewContent} />;
        }
        if (!canUseAI) {
           return (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Icon name="error" className="w-12 h-12 text-[var(--text-danger)] mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-danger)]">{t('coach.ai_core_offline')}</h3>
                    <p className="text-[var(--text-danger-muted)] mt-2">
                      {t('review.api_key_required')}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-[var(--surface-primary)] rounded-none shadow-[0_0_20px_var(--shadow-accent)] w-full max-w-2xl p-6 border border-[var(--border-accent)] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2">
                        <Icon name="bar-chart-2" className="w-6 h-6 text-[var(--text-primary)]" />
                        {t('review.title')}
                    </h2>
                    <button onClick={onClose} className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] text-2xl leading-none transition-transform hover:rotate-90">&times;</button>
                </div>
                <div className="overflow-y-auto pe-2">
                   {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default WeeklyReviewModal;