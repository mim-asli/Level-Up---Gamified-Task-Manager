import React, { useState, useEffect, memo } from 'react';
import moment, { type Moment } from 'moment';
import jmoment from 'jalali-moment';
import { Goal } from '../types.js';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from './Icon.js';
import { useSounds } from '../hooks/useSounds.js';
import ConfirmationModal from './ConfirmationModal.js';
import DatePicker from './DatePicker.js';
import Tag from './Tag.js';


interface GoalItemProps {
    goal: Goal;
    index: number;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, index }) => {
    const { state, dispatch, t, language } = useAppContext();
    const play = useSounds();

    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    
    // Form state for editing
    const [editName, setEditName] = useState(goal.name);
    const [editDailyTask, setEditDailyTask] = useState(goal.dailyTaskDescription || '');
    const [editDeadline, setEditDeadline] = useState(goal.deadline || '');
    const [editStartsAt, setEditStartsAt] = useState(goal.startsAt || '');
    const [editHasDeadline, setEditHasDeadline] = useState(!!goal.deadline);
    const [editHasStartsAt, setEditHasStartsAt] = useState(!!goal.startsAt);
    
    const getMoment = (date?: moment.MomentInput): Moment => {
        const input = moment.isMoment(date) ? (date as moment.Moment).toDate() : date;
        return (language === 'fa' ? jmoment(input) : moment(input)) as any;
    };

    const handleToggleStatus = () => {
        play(goal.isActive ? 'toggleOff' : 'toggleOn');
        dispatch({ type: 'TOGGLE_GOAL_STATUS', payload: { id: goal.id } });
    };
    
    const handleEdit = () => {
        play('click');
        setEditName(goal.name);
        setEditDailyTask(goal.dailyTaskDescription || '');
        setEditDeadline(goal.deadline || '');
        setEditStartsAt(goal.startsAt || '');
        setEditHasDeadline(!!goal.deadline);
        setEditHasStartsAt(!!goal.startsAt);
        setIsEditing(true);
    };

    const handleDelete = () => {
        play('click');
        setIsConfirmDeleteOpen(true);
    };
    
    const confirmDelete = () => {
        play('error');
        dispatch({ type: 'DELETE_GOAL', payload: { id: goal.id } });
        setIsConfirmDeleteOpen(false);
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editName.trim() && (!editHasDeadline || editDailyTask.trim())) {
            play('add');
            dispatch({
                type: 'EDIT_GOAL',
                payload: {
                    id: goal.id,
                    name: editName,
                    dailyTaskDescription: editHasDeadline ? editDailyTask : '',
                    deadline: editHasDeadline ? editDeadline : '',
                    startsAt: editHasStartsAt ? editStartsAt : '',
                }
            });
            setIsEditing(false);
        }
    };

    const ActionButtons = () => (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--surface-primary)] via-[var(--surface-primary)] to-transparent flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {!goal.isQuestline && (
                <button
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-none bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] transition-colors"
                    title={t('goals.edit')}
                >
                    <Icon name="settings" className="w-4 h-4" />
                    <span>{t('goals.edit')}</span>
                </button>
            )}
            <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-none bg-[var(--accent-danger)] hover:bg-[var(--accent-danger-hover)] text-[var(--accent-danger-text)] transition-colors"
                title={t('goals.delete')}
            >
                <Icon name="error" className="w-4 h-4" />
                <span>{t('goals.delete')}</span>
            </button>
        </div>
    );

    if (isEditing) {
        return (
            <div className="p-5 rounded-none border-2 border-[var(--border-accent)] shadow-[0_0_15px_var(--shadow-accent)] bg-[var(--surface-primary)] h-full flex flex-col">
                <form onSubmit={handleSaveEdit} className="space-y-4 flex flex-col flex-grow">
                     <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('goals.manual_name')}</label>
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] border border-[var(--border-secondary)] focus:ring-1 focus:ring-[var(--border-accent)]" required />
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id={`edit-has-deadline-${goal.id}`} checked={editHasDeadline} onChange={e => setEditHasDeadline(e.target.checked)} className="h-4 w-4 rounded-none bg-[var(--surface-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer" />
                        <label htmlFor={`edit-has-deadline-${goal.id}`} className="text-sm font-medium text-[var(--text-muted)] cursor-pointer">{t('goals.set_deadline')}</label>
                    </div>
                    {editHasDeadline && <DatePicker value={editDeadline} onChange={setEditDeadline} min={new Date().toISOString().split('T')[0]} />}

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id={`edit-has-startdate-${goal.id}`} checked={editHasStartsAt} onChange={e => setEditHasStartsAt(e.target.checked)} className="h-4 w-4 rounded-none bg-[var(--surface-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer" />
                        <label htmlFor={`edit-has-startdate-${goal.id}`} className="text-sm font-medium text-[var(--text-muted)] cursor-pointer">{t('goals.set_start_date')}</label>
                    </div>
                    {editHasStartsAt && <DatePicker value={editStartsAt} onChange={setEditStartsAt} min={new Date().toISOString().split('T')[0]} />}
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('goals.manual_daily_task')}</label>
                        <input type="text" value={editDailyTask} onChange={(e) => setEditDailyTask(e.target.value)} className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] border border-[var(--border-secondary)] focus:ring-1 focus:ring-[var(--border-accent)]" required={editHasDeadline} disabled={!editHasDeadline} />
                    </div>

                    <div className="flex gap-2 pt-2 mt-auto">
                        <button type="button" onClick={() => setIsEditing(false)} className="w-full bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] font-bold py-2 px-4 rounded-none transition-colors">{t('cancel')}</button>
                        <button type="submit" className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-colors">{t('goals.save')}</button>
                    </div>
                </form>
            </div>
        )
    }

    // --- Questline Specific Logic ---
    if (goal.isQuestline && goal.questline) {
        const { currentStep, steps } = goal.questline;
        const progress = (currentStep / steps.length) * 100;
        const currentTask = state.tasks.find(task => task.goalId === goal.id && !task.completed);

        return (
             <>
                <div
                  className={`
                    relative flex flex-col p-5 pb-16 rounded-none border transition-all duration-300 h-full group animate-list-item
                    ${goal.isActive ? 'bg-[var(--surface-primary)] border-[var(--border-secondary)]' : 'bg-[var(--surface-tertiary)] border-[var(--border-primary)] opacity-70'}
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="text-xl font-bold text-[var(--text-secondary)] flex-grow pe-8">{goal.name}</h3>
                        <div className="flex items-center">
                            <input type="checkbox" checked={goal.isActive} onChange={handleToggleStatus} className="sr-only peer" id={`toggle-${goal.id}`} />
                            <label htmlFor={`toggle-${goal.id}`} className="relative w-11 h-6 bg-[var(--interactive-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)] cursor-pointer" aria-label={goal.isActive ? t('goals.pause_objective') : t('goals.activate_objective')}></label>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[var(--surface-secondary)] p-3 rounded-none my-2 border-t border-b border-[var(--border-primary)]">
                        <Icon name="tasks" className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                        <p className="text-sm text-[var(--text-primary)]">
                            <strong className="text-[var(--text-muted)]">{t('goals.questline_current_directive')}:</strong>{' '}
                            <span className="font-semibold">{currentTask ? currentTask.text : t('goals.questline_complete')}</span>
                        </p>
                    </div>
                    
                    <div className="mt-auto pt-4">
                        <div className="flex justify-between text-xs font-medium text-[var(--text-muted)] mb-1">
                            <span>{t('goals.progress')}</span>
                            <span>{t('goals.questline_step_progress', { completed: currentStep, total: steps.length })}</span>
                        </div>
                        <div
                          role="progressbar"
                          aria-valuenow={currentStep}
                          aria-valuemin={0}
                          aria-valuemax={steps.length}
                          aria-label={t('goals.progress')}
                          className="w-full bg-[var(--surface-tertiary)] rounded-none h-2.5 border border-[var(--border-primary)]"
                        >
                            <div className="bg-[var(--accent-primary)] h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <ActionButtons />
                </div>
                <ConfirmationModal
                    isOpen={isConfirmDeleteOpen}
                    onClose={() => setIsConfirmDeleteOpen(false)}
                    onConfirm={confirmDelete}
                    title={t('goals.delete_confirm_title')}
                    message={t('goals.delete_confirm_message')}
                />
            </>
        );
    }
    
    // --- Regular Goal Logic ---
    const goalTasks = state.tasks.filter(t => t.goalId === goal.id);
    const completedCount = goalTasks.filter(t => t.completed).length;
    const hasTags = goal.tags && goal.tags.length > 0;
    const isPending = !goal.isActive && goal.startsAt && getMoment(goal.startsAt).isAfter(getMoment(), 'day');

    let progress = 0;
    let totalDays = 0;
    if (goal.deadline) {
        const startDate: Moment = getMoment(goal.createdAt);
        const endDate: Moment = getMoment(goal.deadline);
        totalDays = Math.max(endDate.diff(startDate, 'days') + 1, 1);
        progress = totalDays > 0 ? Math.min((completedCount / totalDays) * 100, 100) : 0;
    }


    return (
        <>
        <div
          className={`
            relative flex flex-col p-5 pb-16 rounded-none border transition-all duration-300 h-full group animate-list-item
            ${goal.isActive ? 'bg-[var(--surface-primary)] border-[var(--border-secondary)]' : 'bg-[var(--surface-tertiary)] border-[var(--border-primary)] opacity-70'}
          `}
          style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="text-xl font-bold text-[var(--text-secondary)] flex-grow pe-8">{goal.name}</h3>
                <div className="flex items-center">
                    <input type="checkbox" checked={goal.isActive} onChange={handleToggleStatus} className="sr-only peer" id={`toggle-${goal.id}`} />
                    <label htmlFor={`toggle-${goal.id}`} className="relative w-11 h-6 bg-[var(--interactive-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)] cursor-pointer" aria-label={goal.isActive ? t('goals.pause_objective') : t('goals.activate_objective')}></label>
                </div>
            </div>
            
            <div className="text-sm">
                {isPending ? (
                    <p className="font-semibold text-[var(--text-primary)]">{t('goals.starts_on', {date: getMoment(goal.startsAt).locale(language).format(t('date_formats.full_date'))})}</p>
                ) : goal.deadline ? (
                    <>
                        <p className="text-[var(--text-primary)]">
                            {t('goals.deadline')}: {getMoment(goal.deadline).locale(language).format(t('date_formats.full_date'))}
                        </p>
                        {goal.isActive && <p className="text-[var(--text-muted)]">{t('goals.days_remaining', {days: Math.max(getMoment(goal.deadline).diff(getMoment(), 'days'), 0)})}</p>}
                    </>
                ) : (
                    <p className="font-semibold text-[var(--text-muted)]">{t('goals.no_deadline')}</p>
                )}
            </div>

            {goal.dailyTaskDescription && (
                <div className="space-y-2 bg-[var(--surface-secondary)] p-3 rounded-none my-2 border-t border-b border-[var(--border-primary)]">
                    <div className="flex items-center gap-2">
                        <Icon name="tasks" className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                        <p className="text-sm text-[var(--text-primary)]">
                            {t('goals.daily_directive')}: <span className="font-semibold">{goal.dailyTaskDescription}</span>
                        </p>
                    </div>
                </div>
            )}
             {hasTags && (
                <div className="flex flex-wrap gap-1.5 pt-2 mt-2 border-t border-[var(--border-secondary)]">
                    {goal.tags!.map(tag => <Tag key={tag} tagName={tag} />)}
                </div>
            )}
            
            <div className="mt-auto pt-4">
                {goal.deadline ? (
                    <>
                        <div className="flex justify-between text-xs font-medium text-[var(--text-muted)] mb-1">
                            <span>{t('goals.progress')}</span>
                            <span>{t('goals.days', { completed: completedCount, total: totalDays })}</span>
                        </div>
                        <div
                        role="progressbar"
                        aria-valuenow={completedCount}
                        aria-valuemin={0}
                        aria-valuemax={totalDays}
                        aria-label={t('goals.progress')}
                        className="w-full bg-[var(--surface-tertiary)] rounded-none h-2.5 border border-[var(--border-primary)]"
                        >
                            <div className="bg-[var(--accent-primary)] h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-xs font-medium text-[var(--text-muted)]">
                        {t('goals.days', {completed: completedCount, total: '∞'})}
                    </div>
                )}
            </div>
            <ActionButtons />
        </div>
        <ConfirmationModal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            onConfirm={confirmDelete}
            title={t('goals.delete_confirm_title')}
            message={t('goals.delete_confirm_message')}
        />
        </>
    );
};

export default memo(GoalItem);