


import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import { ALL_ACHIEVEMENTS } from '../lib/achievements.js';
import { Achievement } from '../types.js';
import Icon from './Icon.js';
import { useSounds } from '../hooks/useSounds.js';

const AchievementToast: React.FC<{ achievement: Omit<Achievement, 'name' | 'description'>, onDismiss: () => void }> = ({ achievement, onDismiss }) => {
  const { t } = useAppContext();
  const play = useSounds();
  
  useEffect(() => {
    play('achievement');
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss, play, achievement.id]);

  return (
    <div 
      className="fixed bottom-5 end-5 z-50 flex items-center gap-4 max-w-sm w-full bg-black p-4 rounded-none shadow-[0_0_20px_var(--shadow-accent)] border border-green-500/80 animate-toast-in"
      role="alert"
      aria-live="assertive"
    >
      <style>
        {`
          @keyframes toast-in {
            from { opacity: 0; transform: translateX(var(--toast-translate-x, 100%)); }
            to { opacity: 1; transform: translateX(0); }
          }
          html[dir="ltr"] .animate-toast-in { --toast-translate-x: 100%; }
          html[dir="rtl"] .animate-toast-in { --toast-translate-x: -100%; }
          .animate-toast-in {
             animation: toast-in 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}
      </style>
      <div className="flex-shrink-0 text-green-300 drop-shadow-lg">
        <Icon name="trophy" className="w-10 h-10" />
      </div>
      <div>
        <p className="font-bold text-green-200">{t('notifier.achievement_unlocked')}</p>
        <p className="text-sm text-green-400">{t(achievement.nameKey)}</p>
      </div>
       <button onClick={onDismiss} className="absolute top-2 end-2 text-green-500/70 hover:text-white transition-transform hover:rotate-90">&times;</button>
    </div>
  );
};

const AchievementNotifier: React.FC = () => {
  const { state } = useAppContext();
  const [notificationQueue, setNotificationQueue] = useState<string[]>([]);
  const prevAchievementsRef = useRef<Set<string>>(new Set(state.achievements));

  useEffect(() => {
    const currentAchievements = new Set(state.achievements);
    const prevAchievements = prevAchievementsRef.current;
    
    if (currentAchievements.size > prevAchievements.size) {
      const newAchievements: string[] = [];
      currentAchievements.forEach(id => {
        if (!prevAchievements.has(id)) {
          newAchievements.push(id);
        }
      });
      
      if (newAchievements.length > 0) {
        setNotificationQueue(q => [...q, ...newAchievements]);
      }
    }

    prevAchievementsRef.current = currentAchievements;
  }, [state.achievements]);

  const handleDismiss = () => {
    setNotificationQueue(q => q.slice(1));
  };
  
  if (notificationQueue.length === 0) {
    return null;
  }
  
  const achievementToShow = ALL_ACHIEVEMENTS.find(ach => ach.id === notificationQueue[0]);

  if (!achievementToShow) {
      handleDismiss();
      return null;
  }

  return <AchievementToast achievement={achievementToShow} onDismiss={handleDismiss} />;
};

export default AchievementNotifier;