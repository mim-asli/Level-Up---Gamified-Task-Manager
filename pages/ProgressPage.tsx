
import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import StatCard from '../components/progress/StatCard.js';
import ActivityChart from '../components/progress/ActivityChart.js';
import PriorityDonut from '../components/progress/PriorityDonut.js';
import { usePlayerStats } from '../hooks/usePlayerStats.js';

const ProgressPage: React.FC = () => {
    const { state, t } = useAppContext();
    const { tasks } = state;
    const { totalEarnedXp, streak } = usePlayerStats();

    const keyMetrics = useMemo(() => {
        const completedTasks = tasks.filter(t => t.completed).length;
        const pomodoroSessions = state.pomodoro.sessions;

        return {
            totalXp: totalEarnedXp,
            completedTasks,
            longestStreak: streak,
            pomodoroSessions
        };
    }, [tasks, state.pomodoro, totalEarnedXp, streak]);

    return (
        <div className="space-y-8">
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-3 group">
                    <Icon name="bar-chart-2" className="w-8 h-8 icon-animated" />
                    {t('progress.title')}
                </h1>
                <p className="text-[var(--text-muted)] max-w-2xl">{t('progress.description')}</p>
            </div>

            <div className="space-y-6">
                 <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">{t('progress.key_metrics')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title={t('progress.total_xp_earned')} value={keyMetrics.totalXp} icon="xp" />
                        <StatCard title={t('progress.tasks_completed')} value={keyMetrics.completedTasks} icon="check" />
                        <StatCard title={t('progress.longest_streak')} value={keyMetrics.longestStreak} icon="fire" />
                        <StatCard title={t('progress.pomodoro_sessions')} value={keyMetrics.pomodoroSessions} icon="timer" />
                    </div>
                </div>

                <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">{t('progress.xp_last_7_days')}</h2>
                    <ActivityChart tasks={tasks} />
                </div>
                
                 <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">{t('progress.priority_breakdown')}</h2>
                    <PriorityDonut tasks={tasks} />
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;
