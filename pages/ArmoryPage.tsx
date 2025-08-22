import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import IntelCacheItem from '../components/inventory/IntelCacheItem.js';
import ActiveBoostItem from '../components/inventory/ActiveBoostItem.js';
import CacheOpeningModal from '../components/inventory/CacheOpeningModal.js';
import { Loot, CacheType } from '../types.js';

const lootTable = {
    common: {
        xp: [50, 75, 100],
        boost: {
            chance: 0.2, // 20% chance for a boost
            multipliers: [1.25, 1.50], // +25% or +50%
            durationHours: 1,
        }
    }
}

const ArmoryPage: React.FC = () => {
    const { state, dispatch, t } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openedLoot, setOpenedLoot] = useState<Loot | null>(null);

    const activeBoosts = state.inventory.boosts.filter(b => moment().isBefore(b.expiresAt));

    const generateLoot = (cacheType: CacheType): Loot => {
        const table = lootTable[cacheType];
        const isBoost = Math.random() < table.boost.chance;

        if (isBoost) {
            const multiplier = table.boost.multipliers[Math.floor(Math.random() * table.boost.multipliers.length)];
            return {
                type: 'BOOST',
                boost: {
                    type: 'XP_BOOST',
                    multiplier: multiplier,
                    expiresAt: moment().add(table.boost.durationHours, 'hours').toISOString(),
                    source: `${cacheType}_cache`,
                }
            };
        } else {
            const amount = table.xp[Math.floor(Math.random() * table.xp.length)];
            return { type: 'XP', amount };
        }
    };

    const handleOpenCache = (cacheType: CacheType) => {
        if (state.inventory.caches[cacheType] <= 0) return;
        const loot = generateLoot(cacheType);
        setOpenedLoot(loot);
        setIsModalOpen(true);
        dispatch({ type: 'OPEN_CACHE', payload: { cacheType, loot } });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Delay clearing loot to allow for fade-out animation
        setTimeout(() => setOpenedLoot(null), 300);
    };

    return (
        <>
            <div className="space-y-8">
                <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                    <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-3 group">
                        <Icon name="package" className="w-8 h-8 icon-animated" />
                        {t('armory.title')}
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-2xl">{t('armory.description')}</p>
                </div>

                <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">{t('armory.caches_title')}</h2>
                    {state.inventory.caches.common > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <IntelCacheItem
                                cacheType="common"
                                count={state.inventory.caches.common}
                                onOpen={() => handleOpenCache('common')}
                            />
                        </div>
                    ) : (
                        <p className="text-center text-[var(--text-muted)] py-4">{t('armory.no_caches')}</p>
                    )}
                </div>

                <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">{t('armory.boosts_title')}</h2>
                    {activeBoosts.length > 0 ? (
                        <div className="space-y-3">
                           {activeBoosts.map(boost => (
                               <ActiveBoostItem key={boost.id} boost={boost} />
                           ))}
                        </div>
                    ) : (
                        <p className="text-center text-[var(--text-muted)] py-4">{t('armory.no_boosts')}</p>
                    )}
                </div>
            </div>
            <CacheOpeningModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                loot={openedLoot}
            />
        </>
    );
};

export default ArmoryPage;
