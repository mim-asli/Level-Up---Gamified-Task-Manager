import React, { useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';
import Icon from './Icon.js';

const IntelCacheNotifier: React.FC = () => {
    const { state, dispatch, t } = useAppContext();
    const { newCaches } = state.inventory;
    const play = useSounds();

    useEffect(() => {
        if (newCaches > 0) {
            play('cache_drop');
            const timer = setTimeout(() => {
                dispatch({ type: 'DISMISS_NEW_CACHE_NOTIFIER' });
            }, 5000); // Show for 5 seconds

            return () => clearTimeout(timer);
        }
    }, [newCaches, dispatch, play]);

    if (newCaches === 0) {
        return null;
    }

    return (
        <div 
          className="fixed bottom-5 end-5 z-50 flex items-center gap-4 max-w-sm w-full bg-[var(--surface-primary)] p-4 rounded-none shadow-[0_0_20px_var(--shadow-accent)] border border-[var(--border-accent)] animate-toast-in"
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
          <div className="flex-shrink-0 text-[var(--text-primary)] drop-shadow-lg">
            <Icon name="package" className="w-10 h-10" />
          </div>
          <div>
            <p className="font-bold text-[var(--text-secondary)]">{t('notifier.cache_awarded')}</p>
            <p className="text-sm text-[var(--text-muted)]">{t('armory.common_cache')}</p>
          </div>
           <button onClick={() => dispatch({ type: 'DISMISS_NEW_CACHE_NOTIFIER' })} className="absolute top-2 end-2 text-green-500/70 hover:text-white transition-transform hover:rotate-90">&times;</button>
        </div>
    );
};

export default IntelCacheNotifier;
