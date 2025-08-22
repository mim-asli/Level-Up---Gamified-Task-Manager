import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import { Loot } from '../../types.js';
import Icon from '../Icon.js';
import { useModalKeyControls } from '../../hooks/useModalKeyControls.js';

interface CacheOpeningModalProps {
    isOpen: boolean;
    onClose: () => void;
    loot: Loot | null;
}

const CacheOpeningModal: React.FC<CacheOpeningModalProps> = ({ isOpen, onClose, loot }) => {
    const { t } = useAppContext();
    const play = useSounds();
    const [isDecrypting, setIsDecrypting] = useState(false);

    useModalKeyControls(isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            setIsDecrypting(true);
            play('cache_open');
            const timer = setTimeout(() => {
                setIsDecrypting(false);
            }, 2500); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen, play]);

    if (!isOpen) return null;

    const renderLoot = () => {
        if (!loot) return null;
        if (loot.type === 'XP') {
            return (
                <div className="flex flex-col items-center gap-2">
                    <Icon name="xp" className="w-16 h-16 text-[var(--accent-primary)] drop-shadow-lg" />
                    <p className="text-3xl font-bold text-[var(--text-secondary)]">{t('armory.loot_xp', { amount: loot.amount })}</p>
                </div>
            );
        }
        if (loot.type === 'BOOST') {
            const description = loot.boost.multiplier === 1.25 ? t('armory.loot_boost_25') : t('armory.loot_boost_50');
            return (
                 <div className="flex flex-col items-center gap-2">
                    <Icon name="xp" className="w-16 h-16 text-[var(--accent-primary)] drop-shadow-lg" />
                    <p className="text-2xl font-bold text-center text-[var(--text-secondary)]">{description}</p>
                </div>
            )
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--surface-primary)] rounded-none w-full max-w-sm p-8 border border-[var(--border-accent)] shadow-[0_0_20px_var(--shadow-accent)] flex flex-col items-center text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {isDecrypting ? (
                    <>
                        <style>{`
                            @keyframes flicker {
                                0%, 100% { opacity: 1; }
                                50% { opacity: 0.5; }
                            }
                            .animate-flicker { animation: flicker 0.2s linear infinite; }
                        `}</style>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--text-primary)] mb-4"></div>
                        <h2 className="text-2xl font-bold font-mono text-[var(--text-secondary)] animate-flicker">{t('armory.decrypting')}</h2>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-[var(--text-secondary)] mb-6">{t('armory.loot_found')}</h2>
                        <div className="animate-subtle-fade-in">{renderLoot()}</div>
                        <button onClick={onClose} className="w-full mt-8 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] font-bold py-2 rounded-none transition-colors">
                            {t('armory.close_modal')}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
export default CacheOpeningModal;