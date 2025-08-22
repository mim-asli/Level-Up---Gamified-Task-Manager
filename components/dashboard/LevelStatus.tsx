
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import { usePlayerStats } from '../../hooks/usePlayerStats.js';

const LevelStatus: React.FC = () => {
    const { t } = useAppContext();
    const { 
        totalEarnedXp, 
        currentLevel, 
        progressPercentage,
        xpIntoCurrentLevel,
        xpNeededForLevelUp,
    } = usePlayerStats();

    const animatedLevel = useCountUp(currentLevel, 1000);
    const animatedTotalXp = useCountUp(totalEarnedXp, 1000);
    const animatedXpIntoLevel = useCountUp(xpIntoCurrentLevel, 1000);

    return (
        <div className="space-y-3">
            <div className="flex items-end gap-4">
                <div>
                    <p className="text-lg font-semibold text-[var(--text-muted)] font-mono">{t('level')}</p>
                    <p className="text-5xl font-bold tracking-tighter text-[var(--text-secondary)] font-mono" style={{textShadow: '0 0 8px var(--shadow-accent)'}}>{animatedLevel}</p>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">{t('total_xp')}: {animatedTotalXp.toLocaleString()}</p>
                </div>
            </div>
            <div>
                <div className="flex justify-between text-xs font-medium text-[var(--text-muted)] mb-1">
                    <span>{t('progress_to_level', {level: currentLevel + 1})}</span>
                    <span className="font-mono">{animatedXpIntoLevel.toLocaleString()} / {xpNeededForLevelUp.toLocaleString()} {t('xp')}</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={xpIntoCurrentLevel}
                  aria-valuemin={0}
                  aria-valuemax={xpNeededForLevelUp}
                  aria-label={t('progress_to_level', {level: currentLevel + 1})}
                  className="w-full bg-[var(--surface-tertiary)] h-2.5 rounded-none border border-[var(--border-primary)]"
                >
                    <div 
                        className="bg-[var(--accent-primary)] h-full transition-all duration-500 ease-out" 
                        style={{ 
                            width: `${progressPercentage}%`,
                            boxShadow: '0 0 8px var(--shadow-accent)'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default LevelStatus;