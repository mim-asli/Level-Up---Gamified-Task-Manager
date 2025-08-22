import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Boost } from '../../types.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import Icon from '../Icon.js';

interface ActiveBoostItemProps {
    boost: Boost;
}

const ActiveBoostItem: React.FC<ActiveBoostItemProps> = ({ boost }) => {
    const { t } = useAppContext();
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const duration = moment.duration(moment(boost.expiresAt).diff(moment()));
            if (duration.asSeconds() <= 0) {
                setTimeLeft('Expired');
            } else {
                setTimeLeft(`${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(Math.floor(duration.seconds())).padStart(2, '0')}`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [boost.expiresAt]);

    const description = boost.multiplier === 1.25 ? t('armory.loot_boost_25') : t('armory.loot_boost_50');

    return (
        <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] border-s-4 border-[var(--border-accent)]">
            <div className="flex items-center gap-3">
                <Icon name="xp" className="w-6 h-6 text-[var(--text-primary)]" />
                <div>
                    <p className="font-semibold text-[var(--text-secondary)]">{description}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t('armory.boost_active_for')}</p>
                </div>
            </div>
            <p className="font-mono text-lg font-bold text-[var(--text-secondary)]">{timeLeft}</p>
        </div>
    );
};

export default ActiveBoostItem;
