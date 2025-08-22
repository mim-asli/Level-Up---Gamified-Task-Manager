
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import Icon from '../Icon.js';
import { usePlayerStats } from '../../hooks/usePlayerStats.js';

const SpendableXpStatus: React.FC = () => {
    const { t } = useAppContext();
    const { spendableXp } = usePlayerStats();
    const animatedXp = useCountUp(spendableXp, 1000);

    return (
        <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <Icon name="gift" className="w-6 h-6" />
            <span className="text-2xl font-bold font-mono">{animatedXp}</span>
            <span className="text-sm font-semibold">{t('rewards.spendable_xp')}</span>
        </div>
    );
};
export default SpendableXpStatus;
