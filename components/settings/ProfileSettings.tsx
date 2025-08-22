import React, { useState, useEffect } from 'react';
import Icon from '../Icon.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';

const ProfileSettings: React.FC = () => {
    const { state, dispatch, t } = useAppContext();
    const play = useSounds();
    const [agentName, setAgentName] = useState(state.agentName);

    useEffect(() => {
        setAgentName(state.agentName);
    }, [state.agentName]);

    const handleUpdateName = (e: React.FormEvent) => {
        e.preventDefault();
        if (agentName.trim() && agentName.trim() !== state.agentName) {
            play('add');
            dispatch({ type: 'SET_AGENT_NAME', payload: { name: agentName.trim() } });
        }
    };
    
    return (
        <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
            <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-2">{t('settings.profile_title')}</h2>
            <p className="text-[var(--text-muted)] mb-4">{t('settings.profile_desc')}</p>
            <form onSubmit={handleUpdateName} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder={t('settings.agent_name')}
                    className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                    maxLength={25}
                />
                <button
                    type="submit"
                    className="group flex-shrink-0 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold px-4 py-2 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                    disabled={!agentName.trim() || agentName.trim() === state.agentName}
                >
                    {t('settings.update_name')}
                </button>
            </form>
        </div>
    )
}

export default ProfileSettings;