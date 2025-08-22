import React from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import { CacheType } from '../../types.js';
import Icon from '../Icon.js';

interface IntelCacheItemProps {
    cacheType: CacheType;
    count: number;
    onOpen: () => void;
}

const IntelCacheItem: React.FC<IntelCacheItemProps> = ({ cacheType, count, onOpen }) => {
    const { t } = useAppContext();
    const play = useSounds();
    
    const cacheDetails = {
        common: { nameKey: 'armory.common_cache', color: 'border-[var(--border-accent)]' }
    };
    
    const details = cacheDetails[cacheType];

    return (
        <div className="flex flex-col items-center gap-2">
             <div className="relative group">
                <div className={`aspect-square w-24 h-24 bg-[var(--surface-secondary)] border-2 ${details.color} flex items-center justify-center cursor-pointer transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-[0_0_20px_var(--shadow-accent)]`} onClick={() => { play('click'); onOpen(); }}>
                    <Icon name="package" className="w-12 h-12 text-[var(--text-primary)]" />
                </div>
                <span className="absolute -top-2 -end-2 bg-[var(--accent-primary)] text-[var(--accent-primary-text)] font-bold text-xs rounded-full h-6 w-6 flex items-center justify-center border-2 border-[var(--surface-primary)]">
                    {count}
                </span>
             </div>
             <p className="text-sm font-semibold text-[var(--text-muted)]">{t(details.nameKey)}</p>
        </div>
    );
};

export default IntelCacheItem;
