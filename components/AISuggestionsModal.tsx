

import React, { useState, useEffect } from 'react';
import Icon from './Icon.js';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';
import { useModalKeyControls } from '../hooks/useModalKeyControls.js';

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: string[];
  onAddTasks: (tasks: string[]) => void;
  isLoading: boolean;
  error: string | null;
}

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({ isOpen, onClose, suggestions, onAddTasks, isLoading, error }) => {
  const { t } = useAppContext();
  const play = useSounds();
  const [selectedTasks, setSelectedTasks] = useState<Record<string, boolean>>({});

  useModalKeyControls(isOpen, onClose);

  useEffect(() => {
    if (suggestions.length > 0) {
      const initialSelection = suggestions.reduce((acc, task) => {
        acc[task] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedTasks(initialSelection);
    }
  }, [suggestions]);

  if (!isOpen) {
    return null;
  }

  const handleToggleSelection = (task: string) => {
    setSelectedTasks(prev => ({ ...prev, [task]: !prev[task] }));
  };

  const handleAddClick = () => {
    play('add');
    const tasksToAdd = Object.entries(selectedTasks)
      .filter(([, isSelected]) => isSelected)
      .map(([task]) => task);
    
    if (tasksToAdd.length > 0) {
      onAddTasks(tasksToAdd);
    }
  };

  const handleClose = () => {
    play('click');
    onClose();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
             <p className="mt-4 text-[var(--text-secondary)]">{t('ai_modal.generating_directives')}</p>
        </div>
      );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-center">
                <Icon name="error" className="w-12 h-12 text-[var(--text-danger)] mb-4" />
                <p className="text-[var(--text-danger)]">{error}</p>
                <button onClick={handleClose} className="mt-6 px-4 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors">{t('close')}</button>
            </div>
        );
    }
    
    if (suggestions.length > 0) {
        return (
            <div className="space-y-4">
                <p className="text-[var(--text-secondary)] font-semibold">{t('ai_modal.directives_subtitle')}</p>
                <div className="space-y-3 max-h-60 overflow-y-auto pe-2 border-e-2 border-[var(--border-secondary)]">
                    {suggestions.map((task, index) => (
                        <div key={index} className="flex items-center gap-3 bg-[var(--surface-secondary)] p-3 rounded-none hover:bg-[var(--surface-tertiary)] transition-colors">
                            <input 
                                type="checkbox"
                                id={`suggestion-${index}`}
                                checked={!!selectedTasks[task]}
                                onChange={() => handleToggleSelection(task)}
                                className="h-5 w-5 rounded-none bg-[var(--surface-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer"
                            />
                            <label htmlFor={`suggestion-${index}`} className="text-[var(--text-primary)] flex-grow cursor-pointer">{task}</label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={handleClose} className="px-5 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors">{t('cancel')}</button>
                    <button onClick={handleAddClick} className="px-5 py-2 rounded-none bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold transition-all border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]">
                        {t('ai_modal.add_selected')}
                    </button>
                </div>
            </div>
        );
    }
    
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={handleClose}>
      <div className="bg-[var(--surface-primary)] rounded-none w-full max-w-md p-6 border border-[var(--border-accent)] shadow-[0_0_20px_var(--shadow-accent)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2">
            <Icon name="sparkle" className="w-6 h-6 text-[var(--text-primary)]" />
            {t('ai_modal.directives_title')}
          </h2>
          <button onClick={handleClose} className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] text-2xl leading-none transition-transform hover:rotate-90">&times;</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AISuggestionsModal;