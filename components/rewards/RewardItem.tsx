import React, { useState, memo } from 'react';
import { Reward } from '../../types.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import Icon from '../Icon.js';
import ConfirmationModal from '../ConfirmationModal.js';

interface RewardItemProps {
    reward: Reward;
    spendableXp: number;
}

const RewardItem: React.FC<RewardItemProps> = ({ reward, spendableXp }) => {
    const { dispatch, t } = useAppContext();
    const play = useSounds();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const canAfford = spendableXp >= reward.cost;

    const handleRedeem = () => {
        play('click');
        setIsConfirmOpen(true);
    };

    const confirmRedeem = () => {
        play('achievement');
        dispatch({ type: 'REDEEM_REWARD', payload: { reward } });
        setIsConfirmOpen(false);
    };

    return (
        <>
            <div className={`group bg-[var(--surface-primary)] p-5 rounded-none border flex flex-col items-center text-center transition-all duration-300 ${!canAfford ? 'filter grayscale opacity-60' : 'border-[var(--border-secondary)] hover:border-[var(--border-accent)] hover:-translate-y-1 hover:shadow-[0_0_20px_var(--shadow-accent)]'}`}>
                <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-none mb-4">
                    <Icon name={reward.icon} className="w-12 h-12 text-[var(--text-primary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-secondary)]">{reward.name}</h3>
                {reward.isOneTime && <p className="text-xs font-semibold text-[var(--text-danger)] uppercase my-1">{t('rewards.one_time')}</p>}
                <div className="flex items-center gap-1.5 my-3 bg-[var(--surface-tertiary)] text-lg text-[var(--text-secondary)] font-mono font-bold px-4 py-1 border border-[var(--border-secondary)]">
                    <span>{reward.cost.toLocaleString()}</span>
                    <span>{t('xp')}</span>
                </div>
                <button
                    onClick={handleRedeem}
                    disabled={!canAfford}
                    className="w-full mt-auto bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold py-3 px-5 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                >
                    {t('rewards.redeem')}
                </button>
            </div>
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmRedeem}
                title={t('rewards.confirm_redeem_title')}
                message={t('rewards.confirm_redeem_message', { name: reward.name, cost: reward.cost })}
                confirmText={t('rewards.redeem')}
            />
        </>
    );
};

export default memo(RewardItem);