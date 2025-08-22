import React from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import MySquadView from '../components/squads/MySquadView.js';
import JoinCreateSquadView from '../components/squads/JoinCreateSquadView.js';

const SquadsPage: React.FC = () => {
    const { state, t } = useAppContext();

    return (
        <div className="space-y-8">
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-3 group">
                    <Icon name="shield" className="w-8 h-8 icon-animated" />
                    {t('squads.title')}
                </h1>
                <p className="text-[var(--text-muted)] max-w-2xl">{t('squads.description')}</p>
            </div>
            
            {state.squad ? (
                <MySquadView squad={state.squad} />
            ) : (
                <JoinCreateSquadView />
            )}
        </div>
    );
};

export default SquadsPage;