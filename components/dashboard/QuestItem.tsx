import React from 'react';
import { Quest } from '../../types.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import Icon from '../Icon.js';
import { useSounds } from '../../hooks/useSounds.js';

interface QuestItemProps {
    quest: Quest;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest }) => {
    const { dispatch, t } = useAppContext();
    const play = useSounds();
    const { description, details, current, target, rewardXp, claimed } = quest;

    const isComplete = !claimed && current >= target;
    const progress = Math.min((current / target) * 100, 100);

    const handleClaim = () => {
        if (isComplete) {
            play('achievement');
            dispatch({ type: 'CLAIM_QUEST_REWARD', payload: { quest } });
        }
    };

    return (
        <div className={`relative p-4 bg-[var(--surface-secondary)] border-s-4 transition-all duration-300 ${isComplete ? 'border-[var(--border-accent)]' : 'border-[var(--border-primary)]'} ${claimed ? 'opacity-60' : ''}`}>
            <p className="font-semibold text-[var(--text-secondary)]">{description}</p>
            {details && <p className="text-sm text-[var(--text-muted)] mt-1 italic">"{details}"</p>}
            
            <div className="flex items-center gap-4 mt-3">
                <div className="flex-grow">
                    <div className="flex justify-between text-xs font-medium text-[var(--text-muted)] mb-1">
                        <span>{t('goals.progress')}</span>
                        <span className="font-mono">{current} / {target}</span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={current}
                      aria-valuemin={0}
                      aria-valuemax={target}
                      aria-label={description}
                      className="w-full bg-[var(--surface-tertiary)] h-1.5 rounded-none border border-[var(--border-primary)]"
                    >
                        <div
                            className="bg-[var(--accent-primary)] h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    {claimed ? (
                        <div className="flex items-center gap-2 text-sm font-bold bg-[var(--surface-tertiary)] border border-[var(--border-primary)] text-[var(--text-muted)] px-3 py-1.5 rounded-none">
                            <Icon name="check" className="w-4 h-4" />
                            <span>{t('claimed')}</span>
                        </div>
                    ) : isComplete ? (
                        <button 
                            onClick={handleClaim}
                            className="flex items-center gap-2 text-sm font-bold bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] px-3 py-1.5 rounded-none transition-all border border-[var(--border-accent)] hover:shadow-[0_0_10px_var(--shadow-accent)]"
                        >
                            <Icon name="xp" className="w-4 h-4" />
                            <span>{t('claim')} +{rewardXp} {t('xp')}</span>
                        </button>
                    ) : (
                         <div className="flex items-center gap-2 text-sm font-bold bg-[var(--surface-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] px-3 py-1.5 rounded-none">
                            <Icon name="xp" className="w-4 h-4" />
                            <span>{rewardXp} {t('xp')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestItem;