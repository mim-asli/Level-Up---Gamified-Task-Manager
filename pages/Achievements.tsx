import React from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import { ALL_ACHIEVEMENTS } from '../lib/achievements.js';
import Icon from '../components/Icon.js';
import AchievementCard from '../components/achievements/AchievementCard.js';


const Achievements: React.FC = () => {
  const { state, t } = useAppContext();
  const unlockedIds = new Set(state.achievements);
  const unlockedCount = unlockedIds.size;
  const totalCount = ALL_ACHIEVEMENTS.length;

  return (
    <div className="space-y-8">
      <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-secondary)] flex items-center gap-3">
                <Icon name="trophy" className="w-8 h-8 text-[var(--text-primary)]" />
                {t('achievements.title')}
              </h1>
              <p className="text-[var(--text-muted)] mt-1">
                {t('achievements.unlocked_of', { unlocked: unlockedCount, total: totalCount })}
              </p>
            </div>
             <div className="w-full sm:w-1/3">
                <div className="w-full bg-[var(--surface-tertiary)] h-2.5 rounded-none border border-[var(--border-primary)]">
                    <div 
                        className="bg-[var(--accent-primary)] h-full" 
                        style={{
                            width: `${(unlockedCount / totalCount) * 100}%`,
                            boxShadow: '0 0 8px var(--shadow-accent)'
                        }}>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_ACHIEVEMENTS.map((ach, index) => (
          <AchievementCard 
            key={ach.id} 
            achievement={ach} 
            isUnlocked={unlockedIds.has(ach.id)} 
            imageData={state.achievementImages[ach.id]}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;