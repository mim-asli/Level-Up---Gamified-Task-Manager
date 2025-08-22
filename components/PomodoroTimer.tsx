

import React, { useState, useEffect, useRef, memo } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from './Icon.js';
import { useSounds } from '../hooks/useSounds.js';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

const PomodoroTimer: React.FC = () => {
    const { dispatch, t } = useAppContext();
    const play = useSounds();
    const [timeRemaining, setTimeRemaining] = useState(WORK_MINUTES * 60);
    const [isActive, setIsActive] = useState(false);
    const [isWorkSession, setIsWorkSession] = useState(true);
    const [flash, setFlash] = useState<boolean>(false);

    const intervalRef = useRef<number | null>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsActive(false);
    };

    const startTimer = () => {
        setIsActive(true);
        intervalRef.current = window.setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);
    };

    const triggerFlash = () => {
        setFlash(true);
        setTimeout(() => setFlash(false), 700);
    }

    useEffect(() => {
        if (timeRemaining <= 0) {
            stopTimer();
            triggerFlash(); 
            play('timer');
            if (isWorkSession) {
                dispatch({ type: 'COMPLETE_POMODORO_SESSION' });
                setIsWorkSession(false);
                setTimeRemaining(BREAK_MINUTES * 60);
            } else {
                setIsWorkSession(true);
                setTimeRemaining(WORK_MINUTES * 60);
            }
        }
    }, [timeRemaining, isWorkSession, dispatch, play]);
    
    useEffect(() => {
        return () => stopTimer();
    }, []);

    const handleStartPause = () => {
        play('click');
        if (isActive) {
            stopTimer();
        } else {
            startTimer();
        }
    };

    const handleReset = () => {
        play('click');
        stopTimer();
        setIsWorkSession(true);
        setTimeRemaining(WORK_MINUTES * 60);
    };

    const totalDuration = (isWorkSession ? WORK_MINUTES : BREAK_MINUTES) * 60;
    const progress = (1 - (timeRemaining / totalDuration)) * 100;
    
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    const flashClass = flash ? 'animate-flash' : '';

    return (
        <div className={`bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)] flex flex-col items-center justify-center text-center ${flashClass}`}>
            <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                <Icon name="timer" className="w-6 h-6"/>
                {t('pomodoro.title')}
            </h3>
             <div className="relative w-40 h-40 flex items-center justify-center my-2">
                <svg className="absolute w-full h-full transform -rotate-90" role="img" aria-label={`${t('pomodoro.title')}: ${t('goals.progress')}`}>
                    <circle cx="50%" cy="50%" r={radius} stroke="var(--border-primary)" strokeWidth="8" fill="transparent" />
                    <circle
                        cx="50%" cy="50%"
                        r={radius}
                        stroke="var(--accent-primary)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{transition: 'stroke-dashoffset 1s linear'}}
                    />
                </svg>
                <div className="z-10 text-center">
                    <p role="timer" aria-live="polite" className="text-4xl font-mono font-bold text-[var(--text-secondary)] tracking-widest" style={{textShadow: '0 0 8px var(--shadow-accent)'}}>
                        {formatTime(timeRemaining)}
                    </p>
                    <p className={`text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]`}>
                        {isWorkSession ? t('pomodoro.focus') : t('pomodoro.break')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
                <button
                    onClick={handleStartPause}
                    className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-6 rounded-none transition-all border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                >
                    {isActive ? t('pomodoro.pause') : t('pomodoro.start')}
                </button>
                 <button
                    onClick={handleReset}
                    className="bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] font-bold py-2 px-6 rounded-none transition-colors border border-[var(--border-secondary)]"
                >
                    {t('pomodoro.reset')}
                </button>
            </div>
        </div>
    );
};

export default memo(PomodoroTimer);