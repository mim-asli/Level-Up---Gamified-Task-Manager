
import { useMemo } from 'react';
import { useAppContext } from './useAppContext.js';
import { calculatePlayerLevelState, calculateXpState } from '../lib/utils.js';
import { calculateWeeklyXp } from '../lib/leaderboard.js';

export const usePlayerStats = () => {
    const { state } = useAppContext();
    const { tasks, rewards, redeemedRewards, dailyStreak } = state;

    const levelState = useMemo(() => calculatePlayerLevelState(tasks), [tasks]);
    const xpState = useMemo(() => calculateXpState(tasks, rewards, redeemedRewards), [tasks, rewards, redeemedRewards]);
    const weeklyXp = useMemo(() => calculateWeeklyXp(tasks), [tasks]);

    return {
        ...levelState,
        ...xpState,
        streak: dailyStreak.current,
        weeklyXp,
    };
};
