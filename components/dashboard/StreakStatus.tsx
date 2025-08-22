
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import Icon from '../Icon.js';
import { usePlayerStats } from '../../hooks/usePlayerStats.js';

const StreakStatus: React.FC = () => {
    const { t } = useAppContext();
    const { streak } = usePlayerStats();
    const animatedStreak = useCountUp(streak, 1000);

    return (
        <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <Icon name="fire" className="w-6 h-6" />
            <span className="text-2xl font-bold font-mono">{animatedStreak}</span>
            <span className="text-sm font-semibold">{t('command_center.day_streak')}</span>
        </div>
    );
};

export default StreakStatus;
