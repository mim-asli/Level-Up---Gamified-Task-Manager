import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';
import Icon from './Icon.js';
import DatePicker from './DatePicker.js';
import TagInput from './TagInput.js';

interface AddGoalFormProps {
    onCancel?: () => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onCancel }) => {
    const { state, dispatch, t } = useAppContext();
    const play = useSounds();
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [startsAt, setStartsAt] = useState('');
    const [dailyTaskDescription, setDailyTaskDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    
    const [hasDeadline, setHasDeadline] = useState(true);
    const [hasStartDate, setHasStartDate] = useState(false);

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
        const finalDeadline = hasDeadline ? deadline : undefined;
        const finalStartsAt = hasStartDate ? startsAt : undefined;
        const finalDailyTask = hasDeadline ? dailyTaskDescription : undefined;

        if (name.trim() && (!hasDeadline || dailyTaskDescription.trim())) {
            play('add');
            dispatch({
                type: 'ADD_GOAL',
                payload: { name, deadline: finalDeadline, dailyTaskDescription: finalDailyTask, tags, startsAt: finalStartsAt },
            });
            setName('');
            setDeadline('');
            setStartsAt('');
            setDailyTaskDescription('');
            setTags([]);
            onCancel?.();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-primary)] space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-secondary)]">{t('goals.manual_add_title')}</h3>
            <div>
                <label htmlFor="goal-name" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('goals.manual_name')}</label>
                <input
                    id="goal-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('goals.manual_name_placeholder')}
                    className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                    required
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="has-deadline" checked={hasDeadline} onChange={e => setHasDeadline(e.target.checked)} className="h-4 w-4 rounded-none bg-[var(--surface-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer" />
                    <label htmlFor="has-deadline" className="text-sm font-medium text-[var(--text-muted)] cursor-pointer">{t('goals.set_deadline')}</label>
                </div>
                {hasDeadline && <DatePicker value={deadline} onChange={setDeadline} min={new Date().toISOString().split('T')[0]} />}
            </div>
            
            <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <input type="checkbox" id="has-startdate" checked={hasStartDate} onChange={e => setHasStartDate(e.target.checked)} className="h-4 w-4 rounded-none bg-[var(--surface-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer" />
                    <label htmlFor="has-startdate" className="text-sm font-medium text-[var(--text-muted)] cursor-pointer">{t('goals.set_start_date')}</label>
                </div>
                {hasStartDate && <DatePicker value={startsAt} onChange={setStartsAt} min={new Date().toISOString().split('T')[0]} />}
            </div>
            
            <div>
                <label htmlFor="goal-daily-task" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('goals.manual_daily_task')}</label>
                <input
                    id="goal-daily-task"
                    type="text"
                    value={dailyTaskDescription}
                    onChange={(e) => setDailyTaskDescription(e.target.value)}
                    placeholder={t(hasDeadline ? 'goals.manual_daily_task_placeholder' : 'goals.manual_daily_task_placeholder_no_deadline')}
                    className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                    required={hasDeadline}
                    disabled={!hasDeadline}
                />
            </div>
            <TagInput
                tags={tags}
                setTags={setTags}
                allTags={allTags}
                placeholder={t('tags.add_or_create_skill')}
            />
            <div className="flex gap-2 pt-2">
                 {onCancel && (
                    <button type="button" onClick={onCancel} className="w-full bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] font-bold py-2 px-4 rounded-none transition-colors">
                        {t('cancel')}
                    </button>
                 )}
                <button
                    type="submit"
                    className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                    disabled={!name.trim() || (hasDeadline && (!deadline || !dailyTaskDescription.trim())) || (hasStartDate && !startsAt)}
                >
                    {t('goals.manual_submit')}
                </button>
            </div>
        </form>
    );
};

export default AddGoalForm;