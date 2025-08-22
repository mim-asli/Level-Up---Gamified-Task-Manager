

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';
import AddTaskForm from '../components/AddTaskForm.js';
import TaskList from '../components/TaskList.js';
import Icon from '../components/Icon.js';
import PomodoroTimer from '../components/PomodoroTimer.js';
import WeeklyReview from '../components/dashboard/WeeklyReview.js';
import DashboardHeader from '../components/DashboardHeader.js';
import CommandCenter from '../components/dashboard/CommandCenter.js';
import ProgressiveOnboarding from '../components/onboarding/ProgressiveOnboarding.js';
import DailyQuests from '../components/dashboard/DailyQuests.js';
import { useFilteredTasks } from '../hooks/useFilteredTasks.js';

interface Alert {
  id: string;
  type: 'goal' | 'break';
  title: string;
  message: string;
  ctaLink?: string;
  ctaText?: string;
}

type DashboardTab = 'operations' | 'intel';

const Dashboard: React.FC = () => {
  const { state, t, language } = useAppContext();
  const play = useSounds();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('operations');
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);
  const { todayTasks, completedTodayTasks } = useFilteredTasks();
  
  const todayString = new Date().toISOString().slice(0, 10);

  const generatedAlerts = useMemo(() => {
    const alerts: Alert[] = [];
    const now = moment();

    // 1. Check for stagnant goals (no progress in 3+ days)
    const activeGoals = state.goals.filter(g => g.isActive);
    activeGoals.forEach(goal => {
        const completedGoalTasks = state.tasks.filter(
            t => t.goalId === goal.id && t.completed
        );
        let shouldAlert = false;
        if (completedGoalTasks.length > 0) {
            const lastCompletion = moment.max(
                completedGoalTasks.map(t => moment(t.createdAt))
            );
            if (now.diff(lastCompletion, 'days') >= 3) {
                shouldAlert = true;
            }
        } else if (now.diff(moment(goal.createdAt), 'days') >= 3) {
            // Alert if goal is 3+ days old with no completed tasks
            shouldAlert = true;
        }

        if (shouldAlert) {
            alerts.push({
                id: `goal-${goal.id}`,
                type: 'goal',
                title: t('proactive_ai.stagnant_goal_title'),
                message: t('proactive_ai.stagnant_goal_message', { goalName: goal.name }),
                ctaLink: `/goals`,
                ctaText: t('proactive_ai.stagnant_goal_cta'),
            });
        }
    });

    // 2. Suggest a break after many completed tasks
    const tasksCompletedToday = state.tasks.filter(
        t => t.completed && t.createdAt.startsWith(todayString)
    ).length;
    if (tasksCompletedToday >= 5) {
        alerts.push({
            id: 'break-suggestion',
            type: 'break',
            title: t('proactive_ai.take_break_title'),
            message: t('proactive_ai.take_break_message', { count: tasksCompletedToday }),
            ctaLink: '/', // Link to dashboard where timer is
            ctaText: t('proactive_ai.take_break_cta'),
        });
    }
    
    return alerts;
  }, [state.goals, state.tasks, t, todayString]);

  useEffect(() => {
      // This simple logic resets alerts on each load. For a persistent "dismissed" state,
      // one would need to store dismissed alert IDs in the global state.
      setVisibleAlerts(generatedAlerts);
  }, [generatedAlerts]);
  
  const dismissAlert = (id: string) => {
      play('click');
      setVisibleAlerts(alerts => alerts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8">
      <DashboardHeader isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} />
      
      {/* Proactive AI Briefing Section */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-4">
            {visibleAlerts.map(alert => (
                <div key={alert.id} className="bg-[var(--surface-secondary)] border-s-4 border-[var(--border-accent)] p-4 rounded-none shadow-lg flex items-start gap-4 animate-subtle-fade-in relative transition-all" role="alert">
                    <Icon name="sparkle" className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                    <div className="flex-grow">
                        <h3 className="font-bold text-[var(--text-secondary)]">{alert.title}</h3>
                        <p className="text-[var(--text-primary)] mt-1">{alert.message}</p>
                        {alert.ctaLink && alert.ctaText && (
                            <Link to={alert.ctaLink} onClick={() => play('click')} className="inline-block mt-3 text-sm font-bold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] group/link">
                                {language === 'fa' ? 
                                    <span className="flex items-center gap-2"> <Icon name="chevron-left" className="w-4 h-4 transition-transform group-hover/link:-translate-x-1" /> {alert.ctaText}</span> : 
                                    <span className="flex items-center gap-2">{alert.ctaText} <Icon name="chevron-right" className="w-4 h-4 transition-transform group-hover/link:translate-x-1" /></span>
                                }
                            </Link>
                        )}
                    </div>
                    <button onClick={() => dismissAlert(alert.id)} title={t('proactive_ai.dismiss')} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-transform hover:rotate-90 absolute top-2 end-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            ))}
        </div>
      )}

      <div id="guide-target-command-center">
        <CommandCenter />
      </div>

      {!isFocusMode && (
        <div className="flex p-1 rounded-none border border-[var(--theme-mode-border)] bg-[var(--theme-mode-bg)]">
            <button
                onClick={() => setActiveTab('operations')}
                className={`flex-1 px-4 py-2 rounded-none text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'operations' ? 'bg-[var(--theme-mode-bg-active)] text-[var(--theme-mode-text-active)] shadow-sm' : 'text-[var(--theme-mode-text)] hover:text-[var(--theme-mode-text-active)]'}`}
            >
                <Icon name="tasks" className="w-5 h-5"/>
                {t('dashboard.tab_operations')}
            </button>
            <button
                onClick={() => setActiveTab('intel')}
                className={`flex-1 px-4 py-2 rounded-none text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'intel' ? 'bg-[var(--theme-mode-bg-active)] text-[var(--theme-mode-text-active)] shadow-sm' : 'text-[var(--theme-mode-text)] hover:text-[var(--theme-mode-text-active)]'}`}
            >
                <Icon name="bar-chart-2" className="w-5 h-5"/>
                {t('dashboard.tab_intel')}
            </button>
        </div>
      )}

      {/* Tab Content: Operations */}
      {(activeTab === 'operations' || isFocusMode) && (
        <div className="space-y-6">
          <div id="guide-target-add-task" className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)] space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2 group">
                <Icon name="plus" className="w-6 h-6 icon-animated" />
                <span>{t('dashboard.engage_operation_title')}</span>
            </h2>
            <AddTaskForm />
          </div>

          <div className="space-y-6">
            {todayTasks.length > 0 && <TaskList tasks={todayTasks} title={t('dashboard.todays_ops')} />}
            {completedTodayTasks.length > 0 && <TaskList tasks={completedTodayTasks} title={t('dashboard.completed_ops')} />}
            
            {todayTasks.length === 0 && completedTodayTasks.length === 0 && (
              <div className="text-center py-10 px-4 bg-[var(--surface-primary)] rounded-none border border-[var(--border-primary)]">
                <p className="text-[var(--text-muted)]">{t('dashboard.no_ops_today')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Intel & Tools */}
      {(activeTab === 'intel' && !isFocusMode) && (
          <div className="space-y-6">
            <DailyQuests />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PomodoroTimer />
                <WeeklyReview />
            </div>
          </div>
      )}
      
      <ProgressiveOnboarding />
    </div>
  );
};

export default Dashboard;