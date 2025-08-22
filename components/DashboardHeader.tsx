import React, { useMemo, memo } from 'react';
import moment from 'moment';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from './Icon.js';

interface DashboardHeaderProps {
    isFocusMode: boolean;
    setIsFocusMode: (isFocus: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isFocusMode, setIsFocusMode }) => {
    const { state, t, language } = useAppContext();

    const getGreeting = (): string => {
        const hour = moment().hour();
        const keySuffix = state.theme === 'hacker' ? '' : '_neutral';

        if (hour < 12) {
            return t(`dashboard.greeting_morning${keySuffix}`);
        } else if (hour < 17) {
            return t(`dashboard.greeting_afternoon${keySuffix}`);
        } else {
            return t(`dashboard.greeting_evening${keySuffix}`);
        }
    };

    const quote = useMemo(() => {
        const quotes = t('quotes', {}) as unknown as string[];
        if (!Array.isArray(quotes) || quotes.length === 0) {
            return '';
        }
        // Use the day of the year to get a consistent quote for the entire day.
        const dayOfYear = moment().dayOfYear();
        const quoteIndex = dayOfYear % quotes.length;
        return quotes[quoteIndex];
    }, [t, language]);

    const greeting = getGreeting();
    
    // Use language from context to format date
    const todayFormatted = new Date().toLocaleDateString(language, {
        weekday: t('date_formats.weekday_long') as 'long' | 'short' | 'narrow',
        year: t('date_formats.year_numeric') as 'numeric' | '2-digit',
        month: t('date_formats.month_long') as 'long' | 'short' | 'narrow' | 'numeric' | '2-digit',
        day: t('date_formats.day_numeric') as 'numeric' | '2-digit',
    });


    return (
        <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)] relative">
            <h1 className="text-3xl font-bold text-[var(--text-secondary)]">{greeting}</h1>
            <p className="text-lg text-[var(--text-muted)] mt-1">{todayFormatted}</p>

            <button 
                onClick={() => setIsFocusMode(!isFocusMode)}
                title={isFocusMode ? t('dashboard.exit_focus_mode') : t('dashboard.enter_focus_mode')}
                className={`absolute top-4 end-4 p-2 rounded-none transition-all duration-300 border ${isFocusMode ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] border-[var(--border-accent)] shadow-[0_0_10px_var(--shadow-accent)]' : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-primary)] hover:bg-[var(--surface-tertiary)] hover:border-[var(--border-accent)]'}`}
            >
                <Icon name="crosshair" className="w-6 h-6" />
            </button>


            {quote && !isFocusMode && (
                 <div className="mt-4 flex items-start gap-3 bg-[var(--surface-secondary)] p-4 rounded-none border-t border-b border-[var(--border-primary)]">
                    <Icon name="quote" className="w-5 h-5 text-[var(--text-primary)] flex-shrink-0 mt-1" />
                    <blockquote className="flex-grow">
                        <p className="text-[var(--text-primary)] italic">"{quote}"</p>
                    </blockquote>
                 </div>
            )}
        </div>
    );
};

export default memo(DashboardHeader);