import React from 'react';
import moment, { type Moment } from 'moment';
import jmoment from 'jalali-moment';
import { Task } from '../types.js';
import { useAppContext } from '../hooks/useAppContext.js';

interface CalendarGridProps {
    currentMonth: Moment;
    selectedDate: string;
    onDateSelect: (date: string) => void;
    tasks?: Task[];
    minDate?: string; // YYYY-MM-DD
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentMonth, selectedDate, onDateSelect, tasks, minDate }) => {
    const { t, language } = useAppContext();
    const getMoment = (date?: moment.MomentInput): Moment => {
        const input = moment.isMoment(date) ? (date as moment.Moment).toDate() : date;
        return (language === 'fa' ? jmoment(input) : moment(input)) as any;
    };

    const today = moment().format('YYYY-MM-DD');
    const days = t('weekdays', {}) as unknown as string[];

    const tasksByDate = (tasks || []).reduce((acc, task) => {
        if (task.dueDate) {
            const dateKey = task.dueDate;
            (acc[dateKey] = acc[dateKey] || []).push(task);
        }
        return acc;
    }, {} as Record<string, Task[]>);

    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    
    const startDayOfWeek = startOfMonth.day();
    const calendarDays = [];
    const minMoment = minDate ? moment(minDate) : null;

    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-start-${i}`} className="w-full h-16 sm:h-20"></div>);
    }

    for (let day = startOfMonth.clone(); day.isSameOrBefore(endOfMonth, 'day'); day.add(1, 'day')) {
        const dateKey = day.clone().locale('en').format('YYYY-MM-DD');
        const isDisabled = minMoment ? day.isBefore(minMoment, 'day') : false;

        const isSelected = selectedDate === dateKey;
        const isToday = dateKey === today;
        const hasTasks = tasksByDate[dateKey] && tasksByDate[dateKey].length > 0;

        const dayClasses = `
            w-full h-16 sm:h-20 flex flex-col items-center justify-center rounded-none transition-all duration-200 border
            disabled:opacity-40 disabled:cursor-not-allowed
            ${isSelected
                ? 'bg-accent-primary/30 border-[var(--border-accent)] scale-105 shadow-[0_0_15px_var(--shadow-accent)]' 
                : 'border-transparent hover:bg-[var(--surface-secondary)] hover:border-[var(--border-secondary)]'
            }
            ${!isSelected && isToday ? 'bg-[var(--surface-tertiary)] border-[var(--border-primary)]' : ''}
        `;

        calendarDays.push(
            <button
                key={dateKey}
                className={dayClasses}
                onClick={() => onDateSelect(dateKey)}
                disabled={isDisabled}
                aria-label={day.format(t('date_formats.full_date'))}
                aria-pressed={isSelected}
            >
                <span className={`text-lg font-bold ${isSelected ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                    {day.format(t('date_formats.day_of_month'))}
                </span>
                {hasTasks && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-[var(--accent-primary)]'}`}></div>}
            </button>
        );
    }
    
    return (
        <div className="mt-4">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[var(--text-muted)] text-sm mb-2">
                {days.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays}
            </div>
        </div>
    );
};

export default CalendarGrid;