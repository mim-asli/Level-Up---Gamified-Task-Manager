
import React from 'react';
import { TaskPriority } from '../types.js';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';

interface PrioritySelectorProps {
    value: TaskPriority;
    onChange: (p: TaskPriority) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ value, onChange }) => {
    const { t } = useAppContext();
    const play = useSounds();
    const priorities: { key: TaskPriority, nameKey: string, color: string }[] = [
        { key: 'low', nameKey: 'priority.low', color: 'bg-[var(--text-muted)]' },
        { key: 'medium', nameKey: 'priority.medium', color: 'bg-[var(--border-accent)]' },
        { key: 'high', nameKey: 'priority.high', color: 'bg-[var(--text-danger)]' },
    ];
    
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
            <label className="text-sm font-medium text-[var(--text-muted)]">{t('task.threat_level')}:</label>
            <div className="flex items-stretch bg-[var(--surface-tertiary)] p-1 rounded-none border border-[var(--border-secondary)]">
                {priorities.map(p => (
                    <button
                        key={p.key}
                        type="button"
                        onClick={() => {
                            play('click');
                            onChange(p.key);
                        }}
                        className={`px-3 py-1 rounded-none text-sm transition-all flex items-center gap-2 ${value === p.key ? 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] shadow-inner' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                        <span className={`w-2.5 h-2.5 rounded-full ${p.color}`}></span>
                        <span>{t(p.nameKey)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PrioritySelector;
