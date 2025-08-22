import React, { useMemo, memo } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { isISODateToday } from '../../lib/utils.js';
import Icon from '../Icon.js';
import { Task } from '../../types.js';
import LevelStatus from './LevelStatus.js';
import StreakStatus from './StreakStatus.js';
import SpendableXpStatus from './SpendableXpStatus.js';

const PrimaryThreat = memo(() => {
    const { state, t } = useAppContext();
    const todayString = new Date().toISOString().slice(0, 10);

    const isTaskForToday = (task: Task) => {
        if (task.dueDate) return task.dueDate === todayString;
        return isISODateToday(task.createdAt);
    };

    const primaryThreat = useMemo(() => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const activeGoalIds = new Set(state.goals.filter(g => g.isActive).map(g => g.id));

        return state.tasks
            .filter(task => {
                if (task.completed || !isTaskForToday(task)) {
                    return false;
                }
                // If the task has a goal, the goal must be active.
                if (task.goalId) {
                    return activeGoalIds.has(task.goalId);
                }
                // If the task has no goal, it's a regular task and should be considered.
                return true;
            })
            .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])[0];
    }, [state.tasks, state.goals, todayString]);
    
    const priorityColor = {
        high: 'text-[var(--text-danger)]',
        medium: 'text-[var(--text-primary)]',
        low: 'text-[var(--text-muted)]',
    }[primaryThreat?.priority || 'medium'];

    const isHighPriority = primaryThreat?.priority === 'high';

    const containerClasses = `
        flex-1 p-4 flex flex-col justify-center 
        border-s border-e border-[var(--border-secondary)]
        transition-all duration-500
        ${isHighPriority ? 'animate-danger-pulse' : ''}
    `;

    return (
        <div className={containerClasses}>
            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">{t('command_center.primary_threat')}</h3>
            {primaryThreat ? (
                <div className="flex items-start gap-3 mt-2">
                    <Icon name="crosshair" className={`w-8 h-8 flex-shrink-0 mt-1 ${priorityColor}`} />
                    <div>
                        <p className="text-lg font-semibold text-[var(--text-secondary)]">{primaryThreat.text}</p>
                        <p className={`text-sm font-bold capitalize ${priorityColor}`}>{t(`priority.${primaryThreat.priority}`)}</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 mt-2 text-[var(--text-muted)]">
                     <Icon name="check" className="w-8 h-8 flex-shrink-0" />
                     <p className="text-lg">{t('command_center.no_threat')}</p>
                </div>
            )}
        </div>
    );
});

const SystemStatus = memo(() => {
    const { state, t } = useAppContext();
    const { quests } = state.dailyQuests;
    const completedQuests = quests.filter(q => q.current >= q.target || q.claimed).length;
    const totalQuests = quests.length;
    const progress = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
    
    return (
        <div className="flex-1 p-4 space-y-4">
             <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">{t('command_center.system_status')}</h3>
             {totalQuests > 0 ? (
                 <div>
                    <div className="flex justify-between text-xs font-medium text-[var(--text-muted)] mb-1">
                        <span>{t('command_center.directives_progress')}</span>
                        <span className="font-mono">{t('command_center.directives_complete', {completed: completedQuests, total: totalQuests})}</span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={completedQuests}
                      aria-valuemin={0}
                      aria-valuemax={totalQuests}
                      aria-label={t('command_center.directives_progress')}
                      className="w-full bg-[var(--surface-tertiary)] h-2.5 rounded-none border border-[var(--border-primary)]"
                    >
                        <div 
                            className="bg-[var(--accent-primary)] h-full transition-all duration-500 ease-out" 
                            style={{ 
                                width: `${progress}%`,
                                boxShadow: '0 0 8px var(--shadow-accent)'
                            }}
                        ></div>
                    </div>
                    {progress === 100 && (
                        <p className="text-xs text-[var(--text-primary)] mt-2 text-center animate-pulse">{t('command_center.all_directives_complete')}</p>
                    )}
                </div>
             ) : (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Icon name="calendar" className="w-5 h-5" />
                    <p>{t('command_center.no_directives')}</p>
                </div>
             )}
        </div>
    );
});


const CommandCenter: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="bg-[var(--surface-primary)] p-2 rounded-none border border-[var(--border-faded)] space-y-2">
            <h2 className="text-center text-lg font-bold text-[var(--text-primary)] font-mono tracking-widest">{t('command_center.title')}</h2>
            <div className="flex flex-col md:flex-row bg-[var(--surface-secondary)] border border-[var(--border-primary)]">
                <div className="flex-1 p-4 space-y-4">
                     <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">{t('command_center.agent_vitals')}</h3>
                     <LevelStatus />
                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
                        <StreakStatus />
                        <SpendableXpStatus />
                    </div>
                </div>
                <PrimaryThreat />
                <SystemStatus />
            </div>
        </div>
    );
};

export default memo(CommandCenter);