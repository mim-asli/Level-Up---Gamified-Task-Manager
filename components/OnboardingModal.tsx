import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';
import Icon from './Icon.js';
import { Task, Theme } from '../types.js';
import { useModalKeyControls } from '../hooks/useModalKeyControls.js';

const ThemeCard: React.FC<{
  theme: Theme;
  onSelect: (theme: Theme) => void;
}> = ({ theme, onSelect }) => {
  const { t } = useAppContext();
  
  const themeStyles: Record<Theme, {bg: string, text: string, accent: string}> = {
    hacker: { bg: 'bg-black', text: 'text-green-400', accent: 'bg-green-600' },
    stealth: { bg: 'bg-gray-800', text: 'text-gray-300', accent: 'bg-sky-500' },
    zen: { bg: 'bg-white', text: 'text-gray-700', accent: 'bg-green-600' },
    fantasy: { bg: 'bg-[#fdf6e3]', text: 'text-[#58402c]', accent: 'bg-[#b58900]' }
  };

  const styles = themeStyles[theme];

  return (
    <button
      onClick={() => onSelect(theme)}
      className="group w-full p-4 border-2 border-[var(--border-secondary)] hover:border-[var(--border-accent)] hover:shadow-[0_0_10px_var(--shadow-accent)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center gap-3"
    >
      <div className={`w-full h-16 rounded-none ${styles.bg} flex items-center justify-center gap-2 p-2 border border-[var(--border-primary)]`}>
          <div className={`w-6 h-6 rounded-full ${styles.accent}`}></div>
          <div className={`w-10 h-3 rounded-sm ${styles.text} opacity-50`}></div>
      </div>
      <h3 className="text-lg font-bold text-[var(--text-secondary)]">{t(theme)}</h3>
    </button>
  )
}

const OnboardingModal: React.FC = () => {
  const { state, dispatch, t } = useAppContext();
  const play = useSounds();
  const [step, setStep] = useState(0);

  // Local state for form inputs
  const [agentName, setAgentName] = useState(state.agentName);
  const [taskText, setTaskText] = useState('');
  const [journalText, setJournalText] = useState('');
  const [onboardingTask, setOnboardingTask] = useState<Task | null>(null);
  
  const handleSkip = () => {
    play('click');
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };
  
  useModalKeyControls(true, handleSkip);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleThemeSelect = (theme: Theme) => {
    play('click');
    dispatch({ type: 'SET_THEME', payload: { theme } });
    setStep(1);
  };
  
  const handleNext = () => {
    play('click');
    setStep(s => s + 1);
  };
  
  const handleFinish = () => {
    play('add');
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(agentName.trim()) {
      dispatch({type: 'SET_AGENT_NAME', payload: { name: agentName.trim() }});
      handleNext();
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(taskText.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: taskText,
        xp: 10,
        completed: false,
        createdAt: new Date().toISOString(),
        type: 'USER_TASK',
        priority: 'medium',
      };
      dispatch({ type: 'ADD_TASK', payload: { text: taskText, priority: 'medium' } });
      setOnboardingTask(newTask);
      handleNext();
    }
  };

  const handleCompleteTask = () => {
    if(onboardingTask && !onboardingTask.completed) {
      play('complete');
      setOnboardingTask(t => t ? {...t, completed: true} : null);
      dispatch({ type: 'TOGGLE_TASK_STATUS', payload: { id: onboardingTask.id, xp: onboardingTask.xp } });
      setTimeout(handleNext, 500);
    }
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(journalText.trim()) {
      dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: { text: journalText } });
      handleNext();
    }
  };

  const themeSteps = [
    {
      title: t(`onboarding.${state.theme}.step_1_title`),
      desc: t(`onboarding.${state.theme}.step_1_desc`),
      content: (
          <form onSubmit={handleNameSubmit} className="w-full">
              <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder={t(`onboarding.${state.theme}.step_1_name_placeholder`)}
                  className="w-full bg-[var(--surface-tertiary)] p-3 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                  required
                  autoFocus
              />
              <button type="submit" className="w-full mt-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-all" disabled={!agentName.trim()}>
                  {t(`onboarding.${state.theme}.next`)}
              </button>
          </form>
      )
    },
    {
      title: t(`onboarding.${state.theme}.step_2_title`),
      desc: t(`onboarding.${state.theme}.step_2_desc`),
      content: (
          <form onSubmit={handleTaskSubmit} className="w-full">
              <input
                  type="text"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder={t(`onboarding.${state.theme}.step_2_task_placeholder`)}
                  className="w-full bg-[var(--surface-tertiary)] p-3 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                  required
                  autoFocus
              />
              <button type="submit" className="w-full mt-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-all" disabled={!taskText.trim()}>
                  {t(`onboarding.${state.theme}.next`)}
              </button>
          </form>
      )
    },
    {
      title: t(`onboarding.${state.theme}.step_3_title`),
      desc: t(`onboarding.${state.theme}.step_3_desc`),
      content: onboardingTask ? (
            <div 
                className={`w-full bg-[var(--surface-secondary)] p-4 border flex items-center gap-4 cursor-pointer transition-all duration-300 ${onboardingTask.completed ? 'border-transparent' : 'border-[var(--border-accent)] animate-pulse'}`}
                onClick={handleCompleteTask}
                role="button"
            >
                <div className={`w-6 h-6 rounded-none flex items-center justify-center border-2 transition-all ${onboardingTask.completed ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--border-accent)]'}`}>
                     {onboardingTask.completed && <Icon name="check" className="w-4 h-4 text-[var(--accent-primary-text)]" />}
                </div>
                <span className={`text-lg ${onboardingTask.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>{onboardingTask.text}</span>
            </div>
      ) : null
    },
    {
      title: t(`onboarding.${state.theme}.step_4_title`),
      desc: t(`onboarding.${state.theme}.step_4_desc`),
      content: (
           <form onSubmit={handleJournalSubmit} className="w-full">
              <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder={t(`onboarding.${state.theme}.step_4_journal_placeholder`)}
                  className="w-full h-24 bg-[var(--surface-tertiary)] p-3 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                  required
                  autoFocus
              />
              <button type="submit" className="w-full mt-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-all" disabled={!journalText.trim()}>
                  {t(`onboarding.${state.theme}.next`)}
              </button>
          </form>
      )
    },
    {
      title: t(`onboarding.${state.theme}.step_5_title`),
      desc: t(`onboarding.${state.theme}.step_5_desc`),
      content: (
          <button onClick={handleFinish} className="w-full mt-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-3 px-4 rounded-none transition-all text-lg">
              {t(`onboarding.${state.theme}.finish`)}
          </button>
      )
    }
  ];

  const renderContent = () => {
    if (step === 0) {
      return (
        <div className="w-full max-w-2xl text-center">
            <h2 className="text-3xl font-bold font-mono text-[var(--text-secondary)] mb-6">{t('onboarding.choose_interface')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <ThemeCard theme="hacker" onSelect={handleThemeSelect} />
                <ThemeCard theme="stealth" onSelect={handleThemeSelect} />
                <ThemeCard theme="zen" onSelect={handleThemeSelect} />
                <ThemeCard theme="fantasy" onSelect={handleThemeSelect} />
            </div>
        </div>
      );
    }

    const currentStepContent = themeSteps[step - 1];
    const iconName = state.theme === 'fantasy' ? 'trophy' : 'crosshair';

    return (
      <>
        <Icon name={iconName} className="w-16 h-16 text-[var(--text-primary)] mb-4" />
        <h2 className="text-3xl font-bold text-[var(--text-secondary)] mb-2" style={{fontFamily: 'var(--font-header)'}}>{currentStepContent.title}</h2>
        <p className="text-[var(--text-primary)] mb-6 max-w-lg">{currentStepContent.desc}</p>
        <div className="w-full max-w-md">
            {currentStepContent.content}
        </div>
        <div className="w-full max-w-md mt-6 flex justify-center">
            <div className="flex items-center gap-3">
                {themeSteps.map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i === (step-1) ? 'bg-[var(--accent-primary)] scale-125' : i < (step-1) ? 'bg-[var(--accent-primary)] opacity-50' : 'bg-[var(--border-primary)]'}`}></div>
                ))}
            </div>
        </div>
      </>
    );
  };
  

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-subtle-fade-in">
        <div className="bg-[var(--surface-primary)] rounded-none w-full max-w-4xl p-8 border-2 border-[var(--border-accent)] shadow-[0_0_30px_var(--shadow-accent)] flex flex-col items-center text-center relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 end-4">
                 <button onClick={handleSkip} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">{t(`onboarding.${state.theme}.skip`)}</button>
            </div>
            {renderContent()}
        </div>
    </div>
  );
};

export default OnboardingModal;