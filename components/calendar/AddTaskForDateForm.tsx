import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { TaskPriority } from '../../types.js';
import { useSounds } from '../../hooks/useSounds.js';
import Icon from '../Icon.js';
import PrioritySelector from '../PrioritySelector.js';

const AddTaskForDateForm: React.FC<{ selectedDate: string }> = ({ selectedDate }) => {
    const { t, dispatch } = useAppContext();
    const play = useSounds();
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            play('add');
            dispatch({ type: 'ADD_TASK', payload: { text, dueDate: selectedDate, priority } });
            setText('');
            setPriority('medium');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <PrioritySelector value={priority} onChange={setPriority} />
            <div className="flex gap-2 p-2 bg-[var(--surface-tertiary)] rounded-none border border-[var(--border-secondary)] focus-within:border-[var(--border-accent)] focus-within:shadow-[0_0_10px_var(--shadow-accent)] transition-all">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('task.add_task_for_date')}
                    className="w-full bg-transparent p-2 text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none"
                />
                <button
                    type="submit"
                    className="flex-shrink-0 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold p-3 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                    disabled={!text.trim()}
                    aria-label={t('task.add_new_task')}
                >
                    <Icon name="plus" className="w-5 h-5"/>
                </button>
            </div>
        </form>
    );
};

export default AddTaskForDateForm;
