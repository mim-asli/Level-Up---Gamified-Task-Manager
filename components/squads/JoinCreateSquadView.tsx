import React, { useState, memo } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import Icon from '../Icon.js';

const JoinCreateSquadView: React.FC = () => {
    const { dispatch, t } = useAppContext();
    const play = useSounds();

    const [createName, setCreateName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    
    // In a real app, you'd fetch the squad name based on the code.
    // Here, we'll just mock it for the UI.
    const [joinName, setJoinName] = useState('The Shadow Runners');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (createName.trim()) {
            play('add');
            dispatch({ type: 'CREATE_SQUAD', payload: { name: createName.trim() } });
        }
    };
    
    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        // The join code is simulated, any 6 digit string works
        if (joinCode.trim().length === 6) {
             play('add');
             // We pass the name directly here since we can't look it up
             dispatch({ type: 'CREATE_SQUAD', payload: { name: joinName } });
        }
    };

    return (
        <div className="text-center">
            <p className="text-lg text-[var(--text-muted)] mb-8">{t('squads.not_in_squad')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Squad */}
                <div className="bg-[var(--surface-primary)] p-6 border border-[var(--border-secondary)]">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)] mb-4">{t('squads.create_squad')}</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                         <div>
                            <label htmlFor="squad-name" className="sr-only">{t('squads.squad_name')}</label>
                            <input
                                id="squad-name"
                                type="text"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                                placeholder={t('squads.squad_name_placeholder')}
                                className="w-full bg-[var(--surface-tertiary)] p-3 text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none border border-[var(--border-secondary)] focus:border-[var(--border-accent)]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!createName.trim()}
                            className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold py-3 px-5 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)] text-lg"
                        >
                            {t('squads.create_squad_cta')}
                        </button>
                    </form>
                </div>

                {/* Join Squad */}
                 <div className="bg-[var(--surface-primary)] p-6 border border-[var(--border-secondary)]">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)] mb-4">{t('squads.join_squad')}</h2>
                    <form onSubmit={handleJoin} className="space-y-4">
                         <div>
                            <label htmlFor="invite-code" className="sr-only">{t('squads.invite_code')}</label>
                            <input
                                id="invite-code"
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                placeholder={t('squads.invite_code_placeholder')}
                                className="w-full bg-[var(--surface-tertiary)] p-3 text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none border border-[var(--border-secondary)] focus:border-[var(--border-accent)]"
                                required
                                maxLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={joinCode.trim().length !== 6}
                            className="w-full bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-secondary-text)] font-bold py-3 px-5 rounded-none transition-all duration-200 border border-[var(--border-secondary)] hover:border-[var(--border-accent)] text-lg"
                        >
                            {t('squads.join_squad_cta')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default memo(JoinCreateSquadView);