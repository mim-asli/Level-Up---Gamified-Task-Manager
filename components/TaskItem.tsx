import React, { useState, useEffect, useRef, memo } from 'react';
import { Task, TaskPriority, SubTask } from '../types.js';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from './Icon.js';
import { useSounds } from '../hooks/useSounds.js';
import PrioritySelector from './PrioritySelector.js';
import ConfirmationModal from './ConfirmationModal.js';
import Tag from './Tag.js';

interface TaskItemProps {
  task: Task;
  index: number;
}

const SubTaskList: React.FC<{ task: Task }> = ({ task }) => {
  const { dispatch, t } = useAppContext();
  const play = useSounds();
  const [newSubTaskText, setNewSubTaskText] = useState('');
  
  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTaskText.trim()) {
      play('add');
      dispatch({ type: 'ADD_SUB_TASK', payload: { taskId: task.id, text: newSubTaskText } });
      setNewSubTaskText('');
    }
  };
  
  const handleToggleSubTask = (subTaskId: string) => {
    play('click');
    dispatch({ type: 'TOGGLE_SUB_TASK', payload: { taskId: task.id, subTaskId } });
  };
  
  const handleDeleteSubTask = (subTaskId: string) => {
    play('error');
    dispatch({ type: 'DELETE_SUB_TASK', payload: { taskId: task.id, subTaskId } });
  }

  return (
    <div className="bg-[var(--surface-secondary)] p-4 space-y-3">
      <div className="space-y-2">
        {(task.subTasks || []).map(st => (
          <div key={st.id} className="flex items-center gap-3 group">
            <button
              onClick={() => handleToggleSubTask(st.id)}
              aria-label={`${t(st.completed ? 'task.mark_incomplete' : 'task.mark_complete')}: ${st.text}`}
              className={`w-5 h-5 rounded-sm flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0 
                ${st.completed ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--border-secondary)] hover:border-[var(--border-accent)]'}
              `}
            >
              {st.completed && <Icon name="check" className="w-3 h-3 text-[var(--text-inverted)]" />}
            </button>
            <span className={`flex-grow text-sm ${st.completed ? 'line-through text-[var(--text-faded)]' : 'text-[var(--text-primary)]'}`}>
              {st.text}
            </span>
             <button onClick={() => handleDeleteSubTask(st.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-danger-muted)] hover:text-[var(--text-danger)] transition-opacity" aria-label={`${t('task.delete')}: ${st.text}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddSubTask} className="flex gap-2">
        <input
          type="text"
          value={newSubTaskText}
          onChange={(e) => setNewSubTaskText(e.target.value)}
          placeholder={t('task.addSubtask')}
          className="w-full bg-[var(--surface-tertiary)] px-2 py-1 text-sm rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none ring-1 ring-[var(--border-secondary)] focus:ring-[var(--border-accent)]"
        />
        <button type="submit" disabled={!newSubTaskText.trim()} className="p-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] disabled:opacity-50 disabled:cursor-not-allowed" aria-label={t('task.addSubtask')}>
          <Icon name="plus" className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
};

const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
  const { state, dispatch, t } = useAppContext();
  const play = useSounds();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [showSubTasks, setShowSubTasks] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isToggleable = task.type !== 'QUEST_REWARD';
  const hasSubTasks = task.subTasks && task.subTasks.length > 0;
  const completedSubTasks = hasSubTasks ? task.subTasks!.filter(st => st.completed).length : 0;
  const totalSubTasks = hasSubTasks ? task.subTasks!.length : 0;
  const subTaskProgress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;
  const hasIncompleteSubTasks = hasSubTasks && completedSubTasks < totalSubTasks;
  const hasTags = task.tags && task.tags.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isEditing) {
        setEditText(task.text);
        setEditPriority(task.priority);
    }
  }, [isEditing, task.text, task.priority]);
  
  useEffect(() => {
    if (hasIncompleteSubTasks && task.completed) {
      // This is a failsafe. If a parent task somehow gets completed while subtasks are not,
      // this effect will "un-complete" it. The reducer logic should prevent this, but it's good practice.
      dispatch({ type: 'TOGGLE_TASK_STATUS', payload: { id: task.id, xp: task.xp } });
    }
  }, [hasIncompleteSubTasks, task.completed, task.id, dispatch, task.xp]);

  const handleToggle = () => {
    if (!isToggleable || isEditing || hasIncompleteSubTasks) return;
    
    play(task.completed ? 'click' : 'complete');
    dispatch({ type: 'TOGGLE_TASK_STATUS', payload: { id: task.id, xp: task.xp } });
  };
  
  const getTaskText = () => {
    if (task.type === 'QUEST_REWARD' && task.rewardDetails) {
        return t('quests.quest_reward_task', { description: task.rewardDetails.description });
    }
    return task.text;
  };
  
  const handleEdit = () => { play('click'); setIsEditing(true); setIsMenuOpen(false); };
  const handleDelete = () => { play('click'); setIsConfirmDeleteOpen(true); setIsMenuOpen(false); };
  
  const confirmDelete = () => {
    play('error');
    dispatch({ type: 'DELETE_TASK', payload: { id: task.id } });
    setIsConfirmDeleteOpen(false);
  };

  const handleSaveEdit = () => {
    if(editText.trim()) {
        play('add');
        dispatch({ type: 'EDIT_TASK', payload: { id: task.id, text: editText, priority: editPriority } });
        setIsEditing(false);
    }
  };

  const parentGoal = task.goalId ? state.goals.find(g => g.id === task.goalId) : null;
  const taskText = getTaskText();
  const priorityBgClass = { high: 'bg-[var(--text-danger)]', medium: 'bg-[var(--border-accent)]', low: 'bg-[var(--text-muted)]' }[task.priority];
  const priorityGlowClass = {
    high: 'shadow-[0_0_8px_var(--shadow-danger)]',
    medium: 'shadow-[0_0_8px_var(--shadow-accent)]',
    low: 'shadow-[0_0_8px_var(--shadow-muted)]'
  }[task.priority];
  
  if (isEditing) {
    return (
        <div className="p-4 bg-[var(--surface-secondary)] border-2 border-[var(--border-accent)] shadow-[0_0_10px_var(--shadow-accent)] space-y-4">
            <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none ring-1 ring-[var(--border-secondary)] focus:ring-[var(--border-accent)]"
                autoFocus
            />
            <PrioritySelector value={editPriority} onChange={setEditPriority} />
            <div className="flex gap-2 justify-end">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors text-sm font-bold">{t('cancel')}</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 rounded-none bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] transition-colors text-sm font-bold">{t('task.save')}</button>
            </div>
        </div>
    );
  }

  return (
    <>
      <div
        className={`
          relative group flex flex-col border transition-all duration-300 animate-list-item
          ${task.completed ? 'bg-[var(--surface-tertiary)] border-transparent' : 'bg-[var(--surface-primary)] border-[var(--border-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-secondary)]'}
        `}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className={`absolute top-0 start-0 bottom-0 w-1 transition-all duration-300 ${task.completed ? 'bg-transparent' : `${priorityBgClass} ${priorityGlowClass}`}`}></div>
        <div className="flex items-start justify-between p-4">
          <div className="flex items-start gap-4 flex-grow">
            <button
              onClick={handleToggle}
              disabled={!isToggleable || hasIncompleteSubTasks}
              className={`w-6 h-6 mt-1 rounded-none flex items-center justify-center border transition-all duration-200 flex-shrink-0 
                ${isToggleable ? 'transform hover:scale-110' : ''}
                ${hasIncompleteSubTasks ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${task.completed ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--border-secondary)] group-hover:border-[var(--border-accent)] group-hover:bg-[var(--surface-secondary)]'}
              `}
              aria-label={task.completed ? t('task.mark_incomplete') : t('task.mark_complete')}
              title={hasIncompleteSubTasks ? t('task.parentLockedTooltip') : ''}
            >
              {task.completed && <Icon name="check" className="w-4 h-4 text-[var(--text-inverted)]" />}
            </button>
            <div className="flex-grow pt-1 space-y-2">
              <span className={`${task.completed ? 'line-through text-[var(--text-faded)]' : 'text-[var(--text-secondary)]'}`}>{taskText}</span>
              {parentGoal && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Icon name="link" className="w-3 h-3" />
                  <span>{parentGoal.name}</span>
                </div>
              )}
              {hasTags && (
                <div className="flex flex-wrap gap-1.5">
                  {task.tags!.map(tag => <Tag key={tag} tagName={tag} />)}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ms-4">
              <div className={`flex items-center gap-1.5 px-3 py-1 text-sm font-semibold transition-colors border ${task.completed ? 'bg-[var(--surface-tertiary)] text-[var(--text-muted)] border-[var(--border-primary)]' : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] border-[var(--border-primary)] group-hover:border-[var(--border-secondary)]'}`}>
                <Icon name="xp" className="w-4 h-4"/>
                <span className="font-mono">{task.xp} XP</span>
              </div>
              {isToggleable && (
                <>
                  <button onClick={() => setShowSubTasks(prev => !prev)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors" title={t('task.viewSubtasks')}>
                      <Icon name="git-branch" className="w-5 h-5" />
                  </button>
                  <div className="relative" ref={menuRef}>
                      <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors" aria-label={t('header.more_options')} aria-haspopup="true" aria-expanded={isMenuOpen}>
                          <Icon name="more-vertical" className="w-5 h-5" />
                      </button>
                      {isMenuOpen && (
                          <div className="absolute end-0 mt-1 w-32 bg-[var(--surface-raised)] border border-[var(--border-secondary)] shadow-xl z-10 animate-fade-in-down">
                              <button onClick={handleEdit} className="w-full text-start flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">{t('task.edit')}</button>
                              <button onClick={handleDelete} className="w-full text-start flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-danger)] hover:bg-[var(--surface-danger)]">{t('task.delete')}</button>
                          </div>
                      )}
                  </div>
                </>
              )}
          </div>
        </div>
        {hasSubTasks && (
          <div className="px-4 pb-3">
            <div className="flex justify-between text-xs font-medium text-[var(--text-muted)] mb-1">
              <span id={`subtask-label-${task.id}`}>{t('task.subtasks')}</span>
              <span id={`subtask-value-${task.id}`} className="font-mono">{completedSubTasks} / {totalSubTasks}</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={completedSubTasks}
              aria-valuemin={0}
              aria-valuemax={totalSubTasks}
              aria-labelledby={`subtask-label-${task.id} subtask-value-${task.id}`}
              className="w-full bg-[var(--surface-tertiary)] h-1.5 rounded-none border border-[var(--border-primary)]"
            >
                <div className="bg-[var(--accent-primary)] h-full transition-all duration-500" style={{ width: `${subTaskProgress}%` }}></div>
            </div>
          </div>
        )}
        {showSubTasks && <SubTaskList task={task} />}
      </div>
      <ConfirmationModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={confirmDelete}
          title={t('task.delete_confirm_title')}
          message={t('task.delete_confirm_message')}
      />
    </>
  );
};

export default memo(TaskItem);