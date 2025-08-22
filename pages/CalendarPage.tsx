import React, { useState, useEffect } from 'react';
import moment, { type Moment } from 'moment';
import jmoment from 'jalali-moment';
import { useAppContext } from '../hooks/useAppContext.js';
import CalendarGrid from '../components/CalendarGrid.js';
import TaskList from '../components/TaskList.js';
import Icon, { IconName } from '../components/Icon.js';
import AddTaskForDateForm from '../components/calendar/AddTaskForDateForm.js';


const CalendarPage: React.FC = () => {
    const { state, t, language } = useAppContext();
    
    const [currentMonth, setCurrentMonth] = useState<Moment>(() => ((language === 'fa' ? jmoment() : moment()).locale(language)) as unknown as Moment);
    const [selectedDate, setSelectedDate] = useState(() => moment().format('YYYY-MM-DD'));

    useEffect(() => {
        setCurrentMonth(current => ((language === 'fa' ? jmoment(current.toDate()) : moment(current.toDate())).locale(language)) as unknown as Moment);
    }, [language]);

    const handlePrevMonth = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, 'month'));
    };
    
    const handleToday = () => {
        const todayMoment: any = (language === 'fa' ? jmoment() : moment()).locale(language);
        setCurrentMonth(todayMoment);
        setSelectedDate(moment().format('YYYY-MM-DD'));
    }

    const tasksForSelectedDate = state.tasks.filter(task => task.dueDate === selectedDate);

    const selectedDateMoment: Moment = (language === 'fa' ? jmoment(selectedDate, 'YYYY-MM-DD') : moment(selectedDate, 'YYYY-MM-DD')).locale(language) as unknown as Moment;
    
    const prevIconName: IconName = language === 'fa' ? 'chevron-right' : 'chevron-left';
    const nextIconName: IconName = language === 'fa' ? 'chevron-left' : 'chevron-right';

    return (
        <div className="space-y-8">
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-none hover:bg-[var(--surface-secondary)] transition-colors" aria-label={t('calendar.previous_month')}>
                        <Icon name={prevIconName} className="w-5 h-5"/>
                    </button>
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-[var(--text-secondary)]">{currentMonth.clone().format(t('date_formats.month_year'))}</h2>
                         <button 
                            onClick={handleToday}
                            className="text-sm bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] px-3 py-1.5 rounded-none transition-colors border border-[var(--border-secondary)] text-[var(--accent-secondary-text)]"
                            >
                            {t('today')}
                         </button>
                    </div>
                    <button onClick={handleNextMonth} className="p-2 rounded-none hover:bg-[var(--surface-secondary)] transition-colors" aria-label={t('calendar.next_month')}>
                        <Icon name={nextIconName} className="w-5 h-5"/>
                    </button>
                </div>
                <CalendarGrid 
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    tasks={state.tasks}
                />
            </div>
            
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)] space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2">
                    <Icon name="tasks" className="w-6 h-6" />
                    <span>{t('calendar.operations_for_date', { date: selectedDateMoment.format(t('date_formats.full_date')) })}</span>
                </h2>
                <AddTaskForDateForm selectedDate={selectedDate} />
                <TaskList tasks={tasksForSelectedDate} title="" />
            </div>
        </div>
    );
};

export default CalendarPage;