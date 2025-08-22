import React, { useState, memo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from '../../hooks/useAppContext.js';
import Icon from '../Icon.js';
import { Achievement } from '../../types.js';
import { useSounds } from '../../hooks/useSounds.js';

const AchievementCard: React.FC<{ 
  achievement: Omit<Achievement, 'name' | 'description'>, 
  isUnlocked: boolean,
  imageData: string | undefined,
  index: number
}> = ({ achievement, isUnlocked, imageData, index }) => {
  const { t, dispatch, getNextApiKeyAndRotate, hasEnabledApiKeys } = useAppContext();
  const play = useSounds();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const canUseAI = hasEnabledApiKeys();

  const handleGenerateImage = async () => {
    const apiKey = getNextApiKeyAndRotate();
    if (!apiKey || isLoading) return;
    
    play('click');
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const name = t(achievement.nameKey);
      const description = t(achievement.descriptionKey);

      const prompt = `A cinematic, detailed, digital insignia for the achievement named '${name}'. Description: '${description}'. The style should be cyberpunk, hacker-themed, neon on a dark background, glowing, futuristic.`;
      
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        dispatch({ type: 'ADD_ACHIEVEMENT_IMAGE', payload: { achievementId: achievement.id, imageData: base64ImageBytes }});
      } else {
        throw new Error('No image was generated.');
      }
    } catch (e) {
      console.error("Error generating achievement image:", e);
      play('error');
      setError(t('achievements.generation_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const cardClasses = `
    border rounded-none p-4 flex flex-col gap-3 text-center transition-all duration-300 transform animate-list-item
    ${isUnlocked 
      ? 'bg-[var(--surface-primary)] border-[var(--border-secondary)] hover:border-[var(--border-accent)] hover:-translate-y-1 hover:shadow-[0_0_20px_var(--shadow-accent)]' 
      : 'bg-[var(--surface-tertiary)] filter grayscale opacity-60'
    }
  `;

  const renderImageArea = () => {
    const containerClasses = "aspect-square w-full rounded-none flex items-center justify-center bg-[var(--surface-tertiary)] border border-[var(--border-primary)] overflow-hidden";

    if (imageData) {
      return (
        <img 
          src={`data:image/jpeg;base64,${imageData}`} 
          alt={t(achievement.nameKey)} 
          className="w-full h-full object-cover"
        />
      );
    }
    
    if (isLoading) {
       return (
        <div className={containerClasses}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${containerClasses} flex-col p-4 text-center`}>
          <Icon name="error" className="w-10 h-10 text-[var(--text-danger)] mb-2" />
          <p className="text-sm text-[var(--text-danger-muted)]">{error}</p>
          <button onClick={handleGenerateImage} className="mt-2 px-3 py-1 text-xs rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors">{t('retry')}</button>
        </div>
      );
    }

    if (isUnlocked && canUseAI) {
      return (
        <div className={`${containerClasses} flex-col p-4`}>
          <Icon name={achievement.icon} className="w-12 h-12 text-[var(--text-muted)] mb-2" />
          <p className="text-xs text-[var(--text-muted)] mb-3">{t('achievements.insignia_locked')}</p>
          <button 
            onClick={handleGenerateImage}
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-all border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
          >
            {t('achievements.generate_insignia')}
          </button>
        </div>
      );
    }

    // Default icon for locked achievements or no API key
    return (
      <div className={containerClasses}>
         <Icon name={achievement.icon} className="w-16 h-16" />
      </div>
    )
  };
  
  return (
    <div className={cardClasses} style={{ animationDelay: `${index * 50}ms` }}>
      {renderImageArea()}
      <div className="flex-grow">
        <h3 className={`font-bold text-lg mt-2 ${isUnlocked ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
          {t(achievement.nameKey)}
        </h3>
        <p className="text-sm text-[var(--text-muted)] flex-grow">
          {t(achievement.descriptionKey)}
        </p>
      </div>
    </div>
  );
};

export default memo(AchievementCard);