import React, { memo } from 'react';
import { IconName } from '../Icon.js';
import Icon from '../Icon.js';
import { useCountUp } from '../../hooks/useCountUp.js';

interface StatCardProps {
    title: string;
    value: number;
    icon: IconName;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    const animatedValue = useCountUp(value, 1500);

    return (
        <div className="bg-[var(--surface-secondary)] p-4 border border-[var(--border-primary)] flex items-center gap-4">
            <div className="p-3 bg-[var(--surface-tertiary)] border border-[var(--border-secondary)]">
                <Icon name={icon} className="w-8 h-8 text-[var(--text-primary)]" />
            </div>
            <div>
                <p className="text-sm font-semibold text-[var(--text-muted)]">{title}</p>
                <p className="text-3xl font-bold font-mono text-[var(--text-secondary)]">{animatedValue.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default memo(StatCard);