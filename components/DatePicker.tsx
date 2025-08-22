import React, { useState, useEffect, useRef } from 'react';
import moment, { type Moment } from 'moment';
import jmoment from 'jalali-moment';
import { useAppContext } from '../hooks/useAppContext.js';
import CalendarGrid from './CalendarGrid.js';
import Icon from './Icon.js';

interface DatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    min?: string; // YYYY-MM-DD
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, min }) => {
    const { t, language } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    
    const getMoment = (date?: moment.MomentInput): Moment => {
        const input = date ? (moment.isMoment(date) ? (date as moment.Moment).toDate() : date) : new Date();
        const m = (language === 'fa' ? jmoment(input) : moment(input));
        return m.locale(language) as any;
    };
    
    const [currentMonth, setCurrentMonth] = useState<Moment>(getMoment(value || undefined));
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        // When language changes, update the moment object
        setCurrentMonth(current => getMoment(current.toDate()));
    }, [language]);


    const handleDateSelect = (date: string) => {
        onChange(date);
        setIsOpen(false);
        setCurrentMonth(getMoment(date));
    };
    
    const handlePrevMonth = () => setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
    const handleNextMonth = () => setCurrentMonth(currentMonth.clone().add(1, 'month'));

    const formattedValue = value ? getMoment(value).format(t('date_formats.full_date')) : '';
    const prevIconName: 'chevron-right' | 'chevron-left' = language === 'fa' ? 'chevron-right' : 'chevron-left';
    const nextIconName: 'chevron-right' | 'chevron-left' = language === 'fa' ? 'chevron-left' : 'chevron-right';

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-start text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)] flex justify-between items-center"
            >
                <span>{formattedValue || t('goals.manual_deadline')}</span>
                <Icon name="calendar" className="w-4 h-4 text-[var(--text-muted)]"/>
            </button>
            
            {isOpen && (
                 <div className="absolute top-full start-0 mt-1 w-full bg-[var(--surface-primary)] border border-[var(--border-accent)] shadow-[0_0_20px_var(--shadow-accent)] z-20 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <button type="button" onClick={handlePrevMonth} className="p-2 rounded-none hover:bg-[var(--surface-secondary)] transition-colors">
                            <Icon name={prevIconName} className="w-5 h-5"/>
                        </button>
                        <span className="font-bold text-[var(--text-secondary)]">{currentMonth.format(t('date_formats.month_year'))}</span>
                        <button type="button" onClick={handleNextMonth} className="p-2 rounded-none hover:bg-[var(--surface-secondary)] transition-colors">
                            <Icon name={nextIconName} className="w-5 h-5"/>
                        </button>
                    </div>
                    <CalendarGrid
                        currentMonth={currentMonth}
                        selectedDate={value}
                        onDateSelect={handleDateSelect}
                        minDate={min}
                    />
                 </div>
            )}
        </div>
    );
};

export default DatePicker;
