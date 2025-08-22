import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Skill } from '../../types.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import Icon from '../Icon.js';
import { calculateSkillLevelState } from '../../lib/utils.js';
import { useCountUp } from '../../hooks/useCountUp.js';

interface SkillCardProps {
    skill: Skill;
    index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
    const { t } = useAppContext();
    const {
        currentLevel,
        progressPercentage,
        xpIntoCurrentLevel,
        xpNeededForLevelUp
    } = calculateSkillLevelState(skill.xp);

    const animatedLevel = useCountUp(currentLevel, 1000);
    const animatedTotalXp = useCountUp(skill.xp, 1000);
    const animatedXpIntoLevel = useCountUp(xpIntoCurrentLevel, 1000);
    const animatedXpNeeded = useCountUp(xpNeededForLevelUp, 1000);

    return (
        <div
            className="bg-[var(--surface-secondary)] p-5 rounded-none border border-[var(--border-primary)] flex flex-col gap-4 transition-all duration-300 transform hover:-translate-y-1 hover:border-[var(--border-accent)] hover:shadow-[0_0_20px_var(--shadow-accent)] animate-list-item"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-[var(--text-secondary)]">{skill.name}</h3>
                <div className="text-center">
                    <p className="text-xs font-bold text-[var(--text-muted)] font-mono">{t('skills.level')}</p>
                    <p className="text-3xl font-bold text-[var(--text-secondary)] font-mono">{animatedLevel}</p>
                </div>
            </div>
            
            <div className="space-y-1">
                 <div className="flex justify-between text-xs font-medium text-[var(--text-muted)] mb-1">
                    <span>{t('progress_to_level', {level: currentLevel + 1})}</span>
                    <span className="font-mono">{animatedXpIntoLevel.toLocaleString()} / {animatedXpNeeded.toLocaleString()} {t('xp')}</span>
                </div>
                <div className="w-full bg-[var(--surface-tertiary)] h-2.5 rounded-none border border-[var(--border-primary)]">
                    <div 
                        className="bg-[var(--accent-primary)] h-full transition-all duration-500 ease-out" 
                        style={{ 
                            width: `${progressPercentage}%`,
                            boxShadow: '0 0 8px var(--shadow-accent)'
                        }}
                    ></div>
                </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-[var(--border-primary)] flex flex-col items-center gap-3">
                <p className="text-xs text-[var(--text-muted)] font-mono">{t('total_xp')}: {animatedTotalXp.toLocaleString()}</p>
                 <Link 
                    to={`/skills/${encodeURIComponent(skill.name)}`}
                    className="group w-full flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                >
                    <Icon name="sparkle" className="w-5 h-5 icon-animated" />
                    <span>{t('skills.consult_mentor')}</span>
                </Link>
            </div>
        </div>
    );
};

export default memo(SkillCard);