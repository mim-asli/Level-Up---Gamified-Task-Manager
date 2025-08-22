import React, { useState, useMemo } from 'react';
import { Type } from '@google/genai';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from './Icon.js';
import AITaskBreakdownModal from './AITaskBreakdownModal.js';
import { TaskPriority } from '../types.js';
import { useSounds } from '../hooks/useSounds.js';
import PrioritySelector from './PrioritySelector.js';
import { useAI } from '../hooks/useAI.js';
import TagInput from './TagInput.js';

const AddTaskForm: React.FC = () => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const { state, dispatch, t } = useAppContext();
  const play = useSounds();
  const { generateContent, canUseAI } = useAI();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    state.tasks.forEach(task => task.tags?.forEach(tag => tagSet.add(tag)));
    state.goals.forEach(goal => goal.tags?.forEach(tag => tagSet.add(tag)));
    state.journalEntries.forEach(entry => entry.tags?.forEach(tag => tagSet.add(tag)));
    state.skills.forEach(skill => tagSet.add(skill.name));
    return Array.from(tagSet).sort();
  }, [state.tasks, state.goals, state.journalEntries, state.skills]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      play('add');
      dispatch({ type: 'ADD_TASK', payload: { text, priority, tags } });
      setText('');
      setPriority('medium');
      setTags([]);
    }
  };

  const handleBreakdown = async () => {
      if (!canUseAI || !text.trim()) return;
      
      play('click');
      setIsModalOpen(true);
      setIsBreakingDown(true);
      setAiError(null);
      setSuggestedTasks([]);

      try {
        const response = await generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a productivity assistant with a hacker theme. Break down the following high-level objective into a list of smaller, actionable sub-tasks (exploits). Provide up to 5 sub-tasks. Objective: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subtasks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: 'A small, actionable sub-task with a hacker/cyberpunk feel.'
                            }
                        }
                    },
                    required: ["subtasks"]
                },
            },
        });
        
        const responseJson = JSON.parse(response.text);

        if (responseJson && responseJson.subtasks && Array.isArray(responseJson.subtasks)) {
             setSuggestedTasks(responseJson.subtasks);
        } else {
            throw new Error(t('ai_modal.invalid_response'));
        }
      } catch(e) {
          console.error("Error breaking down task:", e);
          setAiError(e.message || t('ai_modal.connection_error'));
      } finally {
          setIsBreakingDown(false);
      }
  };
  
  const handleAddSuggestedTasks = (tasks: string[]) => {
      play('add');
      dispatch({ type: 'ADD_AI_TASKS', payload: { tasks } });
      setText('');
      closeModal();
  };

  const closeModal = () => {
    play('click');
    setIsModalOpen(false);
  };

  return (
    <>
        <form onSubmit={handleSubmit} className="space-y-4">
            <PrioritySelector value={priority} onChange={setPriority} />
            <div className="flex gap-2 p-2 bg-[var(--surface-primary)] rounded-none border border-[var(--border-secondary)] focus-within:border-[var(--border-accent)] focus-within:shadow-[0_0_10px_var(--shadow-accent)] transition-all">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={canUseAI ? t('task.add_task_placeholder_ai') : t('task.add_task_placeholder')}
                    className="w-full bg-transparent p-2 text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none"
                />
                {canUseAI && (
                    <button
                    type="button"
                    onClick={handleBreakdown}
                    className="group flex-shrink-0 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-secondary-text)] font-bold p-3 rounded-none transition-all duration-200 border border-[var(--border-secondary)] hover:border-[var(--border-accent)] hover:shadow-[0_0_10px_var(--shadow-accent)]"
                    disabled={!text.trim() || isBreakingDown}
                    aria-label={t('task.breakdown_ai')}
                    title={t('task.breakdown_ai')}
                    >
                    {isBreakingDown ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
                    ) : (
                        <Icon name="sparkle" className="w-5 h-5 icon-animated"/>
                    )}
                    </button>
                )}
                <button
                    type="submit"
                    className="group flex-shrink-0 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold p-3 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                    disabled={!text.trim()}
                    aria-label={t('task.add_new_task')}
                >
                    <Icon name="plus" className="w-5 h-5 icon-animated"/>
                </button>
            </div>
            <TagInput
                tags={tags}
                setTags={setTags}
                allTags={allTags}
                placeholder={t('tags.add_or_create_skill')}
            />
        </form>
        <AITaskBreakdownModal 
            isOpen={isModalOpen}
            onClose={closeModal}
            originalTask={text}
            suggestions={suggestedTasks}
            onAddTasks={handleAddSuggestedTasks}
            isLoading={isBreakingDown}
            error={aiError}
        />
    </>
  );
};

export default AddTaskForm;