import React, { useEffect } from 'react';
import Icon from './Icon.js';
import { useCountUp } from '../hooks/useCountUp.js';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';
import Confetti from './Confetti.js';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    newLevel: number;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, newLevel }) => {
    const { t } = useAppContext();
    const play = useSounds();
    const animatedLevel = useCountUp(newLevel, 1200);

    useEffect(() => {
        if (isOpen) {
            play('levelUp');
        }
    }, [isOpen, play]);
    
    useEffect(() => {
        if (isOpen) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    onClose();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-subtle-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="levelup-title"
        >
            <Confetti isActive={isOpen} />
            <div 
                className="bg-[var(--surface-primary)] rounded-none w-full max-w-lg p-8 border-2 border-[var(--border-accent)] shadow-[0_0_30px_var(--shadow-accent)] text-center flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Icon name="level-up" className="w-20 h-20 text-[var(--text-primary)]" />
                <h2 id="levelup-title" className="text-5xl font-bold font-mono text-[var(--text-secondary)] my-4 glitch-text" style={{textShadow: '0 0 10px var(--shadow-accent)'}}>
                    {t('level_up.title')}
                </h2>
                <p className="text-lg text-[var(--text-muted)] uppercase tracking-wider">{t('level_up.subtitle')}</p>
                <p className="text-8xl font-bold font-mono text-[var(--text-secondary)] my-4" style={{textShadow: '0 0 15px var(--shadow-accent)'}}>
                    {animatedLevel}
                </p>
                <p className="text-[var(--text-primary)] mb-8">{t('level_up.description')}</p>
                <button
                    onClick={onClose}
                    className="w-full max-w-xs bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-3 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)] text-lg"
                    aria-label={t('level_up.cta')}
                >
                    {t('level_up.cta')}
                </button>
            </div>
        </div>
    );
};

export default LevelUpModal;