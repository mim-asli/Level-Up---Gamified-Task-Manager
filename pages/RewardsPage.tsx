
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import AddRewardForm from '../components/rewards/AddRewardForm.js';
import RewardItem from '../components/rewards/RewardItem.js';
import { useCountUp } from '../hooks/useCountUp.js';
import moment from 'moment';
import { usePlayerStats } from '../hooks/usePlayerStats.js';

type RewardView = 'shop' | 'history';

const RewardsPage: React.FC = () => {
    const { state, t, language } = useAppContext();
    const [view, setView] = useState<RewardView>('shop');
    const [showAddForm, setShowAddForm] = useState(false);

    const { spendableXp } = usePlayerStats();
    const animatedSpendableXp = useCountUp(spendableXp, 1000);

    const redeemedIds = useMemo(() => new Set(
        state.redeemedRewards
            .map(rr => state.rewards.find(r => r.id === rr.rewardId))
            .filter(r => r && r.isOneTime)
            .map(r => r!.id)
    ), [state.redeemedRewards, state.rewards]);
    
    const availableRewards = state.rewards.filter(r => !redeemedIds.has(r.id));
    
    const sortedHistory = useMemo(() => {
        return [...state.redeemedRewards]
            .map(rr => ({
                ...rr,
                reward: state.rewards.find(r => r.id === rr.rewardId)
            }))
            .filter(item => item.reward) // Filter out items where reward is not found
            .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());
    }, [state.redeemedRewards, state.rewards]);

    const renderContent = () => {
        if (view === 'shop') {
            return (
                <>
                    <div className={`p-4 bg-[var(--surface-secondary)] border border-[var(--border-primary)] transition-all duration-300 ${showAddForm ? 'max-h-screen' : 'max-h-0 overflow-hidden p-0 border-0'}`}>
                        <AddRewardForm onFormSubmit={() => setShowAddForm(false)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableRewards.map(reward => (
                            <RewardItem key={reward.id} reward={reward} spendableXp={spendableXp} />
                        ))}
                    </div>
                     {availableRewards.length === 0 && (
                         <div className="text-center py-10 px-4 bg-[var(--surface-primary)] rounded-none border border-[var(--border-primary)] md:col-span-2 lg:col-span-3">
                            <p className="text-[var(--text-muted)]">{t('rewards.no_rewards_placeholder')}</p>
                         </div>
                     )}
                </>
            );
        }
        
        if (view === 'history') {
             return (
                <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                    {sortedHistory.length > 0 ? (
                        <ul className="space-y-3">
                            {sortedHistory.map(item => (
                                <li key={item.id} className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] border-s-4 border-[var(--border-secondary)]">
                                    <div className="flex items-center gap-3">
                                        <Icon name={item.reward!.icon} className="w-6 h-6 text-[var(--text-primary)]" />
                                        <div>
                                            <p className="font-semibold text-[var(--text-secondary)]">{item.reward!.name}</p>
                                            <p className="text-xs text-[var(--text-muted)]">
                                                {moment(item.redeemedAt).locale(language).format(t('date_formats.full_date'))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-mono font-bold text-[var(--text-danger)]">- {item.reward!.cost} {t('xp')}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <div className="text-center py-10 px-4">
                            <p className="text-[var(--text-muted)]">{t('rewards.no_history_placeholder')}</p>
                         </div>
                    )}
                </div>
             );
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-3 group">
                            <Icon name="gift" className="w-8 h-8 icon-animated" />
                            {t('rewards.title')}
                        </h1>
                        <p className="text-[var(--text-muted)] max-w-2xl">{t('rewards.description')}</p>
                    </div>
                    <div className="text-center bg-[var(--surface-secondary)] p-3 border border-[var(--border-primary)]">
                        <p className="text-sm font-semibold text-[var(--text-muted)] uppercase">{t('rewards.spendable_xp')}</p>
                        <p className="text-3xl font-bold font-mono text-[var(--text-secondary)]">{animatedSpendableXp.toLocaleString()}</p>
                    </div>
                </div>
                 <div className="mt-6 border-t border-[var(--border-primary)] pt-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex p-1 rounded-none border border-[var(--theme-mode-border)] bg-[var(--theme-mode-bg)]">
                        <button onClick={() => setView('shop')} className={`px-4 py-1.5 rounded-none text-sm transition-colors ${view === 'shop' ? 'bg-[var(--theme-mode-bg-active)] text-[var(--theme-mode-text-active)] shadow-sm' : 'text-[var(--theme-mode-text)] hover:text-[var(--theme-mode-text-active)]'}`}>{t('rewards.shop')}</button>
                        <button onClick={() => setView('history')} className={`px-4 py-1.5 rounded-none text-sm transition-colors ${view === 'history' ? 'bg-[var(--theme-mode-bg-active)] text-[var(--theme-mode-text-active)] shadow-sm' : 'text-[var(--theme-mode-text)] hover:text-[var(--theme-mode-text-active)]'}`}>{t('rewards.history')}</button>
                    </div>
                     <button
                        onClick={() => setShowAddForm(prev => !prev)}
                        className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] font-bold py-2 px-4 rounded-none transition-all duration-200 border border-[var(--border-secondary)]"
                    >
                        <Icon name="plus" className="w-5 h-5 icon-animated" />
                        <span>{t('rewards.add_reward_cta')}</span>
                    </button>
                </div>
            </div>

            {renderContent()}

        </div>
    );
};

export default RewardsPage;
