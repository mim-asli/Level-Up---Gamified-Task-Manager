import React from 'react';
import moment from 'moment';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from './Icon.js';
import { Goal } from '../types.js';
import { useSounds } from '../hooks/useSounds.js';

interface AIGoalSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: Goal[];
  onAddGoal: (goal: Goal) => void;
  isLoading: boolean;
  error: string | null;
}

const SuggestionCard: React.FC<{ goal: Goal, onAdd: (goal: Goal) => void }> = ({ goal, onAdd }) => {
    const { t, language } = useAppContext();
    const play = useSounds();
    const deadlineMoment = language === 'fa' ? moment(goal.deadline, 'YYYY-MM-DD').locale('fa') : moment(goal.deadline, 'YYYY-MM-DD');

    return (
        <div className="bg-[var(--surface-secondary)] p-4 rounded-none border border-[var(--border-primary)] space-y-3">
            <h3 className="font-bold text-lg text-[var(--text-secondary)]">{goal.name}</h3>
            <div className="text-sm">
                <p><strong className="text-[var(--text-muted)]">{t('ai_goal_modal.daily_directive')}:</strong> <span className="text-[var(--text-primary)]">{goal.dailyTaskDescription}</span></p>
                <p><strong className="text-[var(--text-muted)]">{t('ai_goal_modal.deadline')}:</strong> <span className="text-[var(--text-primary)]">{deadlineMoment.format(t('date_formats.full_date'))}</span></p>
            </div>
            <button
                onClick={() => onAdd(goal)}
                className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-all border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
            >
                {t('ai_goal_modal.add_objective')}
            </button>
        </div>
    );
};

const AIGoalSuggestionsModal: React.FC<AIGoalSuggestionsModalProps> = ({ isOpen, onClose, suggestions, onAddGoal, isLoading, error }) => {
  const { t } = useAppContext();
  const play = useSounds();

  if (!isOpen) return null;

  const handleClose = () => {
    play('click');
    onClose();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
             <p className="mt-4 text-[var(--text-secondary)]">{t('ai_goal_modal.loading')}</p>
        </div>
      );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Icon name="error" className="w-12 h-12 text-[var(--text-danger)] mb-4" />
                <p className="text-[var(--text-danger)]">{error}</p>
                <button onClick={handleClose} className="mt-6 px-4 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors">{t('close')}</button>
            </div>
        );
    }
    
    if (suggestions.length > 0) {
        return (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pe-2">
                {suggestions.map((goal) => (
                    <SuggestionCard key={goal.id} goal={goal} onAdd={onAddGoal} />
                ))}
            </div>
        );
    }

    // No suggestions found
     return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <Icon name="journal" className="w-12 h-12 text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-muted)]">{t('ai_goal_modal.no_suggestions')}</p>
            <button onClick={handleClose} className="mt-6 px-4 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors">{t('close')}</button>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={handleClose}>
      <div className="bg-[var(--surface-primary)] rounded-none w-full max-w-lg p-6 border border-[var(--border-accent)] shadow-[0_0_20px_var(--shadow-accent)] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2">
            <Icon name="goal" className="w-6 h-6 text-[var(--text-primary)]" />
            {t('ai_goal_modal.title')}
          </h2>
          <button onClick={handleClose} className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] text-2xl leading-none transition-transform hover:rotate-90">&times;</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AIGoalSuggestionsModal;
