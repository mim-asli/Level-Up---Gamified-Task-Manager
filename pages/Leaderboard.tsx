
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import { generateFakeLeaderboardData } from '../lib/leaderboard.js';
import { usePlayerStats } from '../hooks/usePlayerStats.js';

type LeaderboardCategory = 'weekly_xp' | 'streak' | 'total_xp';

interface AgentScore {
    userId: string;
    agentName: string;
    score: number;
}

const LeaderboardRow: React.FC<{ rank: number, agent: AgentScore, isCurrentUser: boolean }> = ({ rank, agent, isCurrentUser }) => {
    const { t } = useAppContext();
    const rowClass = `
        flex items-center p-3 transition-colors duration-200
        ${isCurrentUser 
            ? 'bg-[var(--accent-primary)]/20 text-[var(--text-secondary)] border-y-2 border-[var(--border-accent)]' 
            : 'bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)]'
        }
    `;

    return (
        <div className={rowClass}>
            <div className="w-12 text-center text-lg font-mono">{rank}</div>
            <div className="flex-grow font-semibold">{agent.agentName} {isCurrentUser && `(${t('leaderboard.you')})`}</div>
            <div className="w-24 text-end font-mono font-bold text-[var(--text-primary)]">{agent.score.toLocaleString()}</div>
        </div>
    );
};

const Leaderboard: React.FC = () => {
    const { state, t } = useAppContext();
    const [category, setCategory] = useState<LeaderboardCategory>('weekly_xp');
    const { weeklyXp, streak, totalEarnedXp } = usePlayerStats();

    const currentUserData = useMemo(() => {
        return {
            userId: state.userId,
            agentName: state.agentName,
            weeklyXp: weeklyXp,
            streak: streak,
            totalXp: totalEarnedXp,
        };
    }, [state.userId, state.agentName, weeklyXp, streak, totalEarnedXp]);
    
    const leaderboardData = useMemo(() => {
        const data = generateFakeLeaderboardData(currentUserData);
        let sortedData: AgentScore[];
        
        switch (category) {
            case 'weekly_xp':
                sortedData = data.map(d => ({ userId: d.userId, agentName: d.agentName, score: d.weeklyXp }));
                break;
            case 'streak':
                 sortedData = data.map(d => ({ userId: d.userId, agentName: d.agentName, score: d.streak }));
                break;
            case 'total_xp':
                 sortedData = data.map(d => ({ userId: d.userId, agentName: d.agentName, score: d.totalXp }));
                break;
        }
        
        return sortedData.sort((a, b) => b.score - a.score);

    }, [currentUserData, category]);

    const tabs: { key: LeaderboardCategory, nameKey: string }[] = [
        { key: 'weekly_xp', nameKey: 'leaderboard.weekly_xp' },
        { key: 'streak', nameKey: 'leaderboard.streak' },
        { key: 'total_xp', nameKey: 'leaderboard.total_xp' },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-3 group">
                    <Icon name="users" className="w-8 h-8 icon-animated" />
                    {t('leaderboard.title')}
                </h1>
                <p className="text-[var(--text-muted)] max-w-2xl">{t('leaderboard.description')}</p>
            </div>

            <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)]">
                <div className="flex p-1 border-b border-[var(--border-primary)] bg-[var(--surface-tertiary)]">
                     {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setCategory(tab.key)}
                            className={`flex-1 py-2 px-4 text-center font-semibold transition-colors duration-200 rounded-none
                                ${category === tab.key 
                                    ? 'bg-[var(--surface-primary)] text-[var(--text-secondary)] shadow-inner' 
                                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]'
                                }
                            `}
                        >
                            {t(tab.nameKey)}
                        </button>
                    ))}
                </div>
                
                {leaderboardData.length > 0 ? (
                    <div className="space-y-1">
                         <div className="flex items-center p-3 text-sm font-bold text-[var(--text-muted)] border-b border-[var(--border-secondary)]">
                            <div className="w-12 text-center">{t('leaderboard.rank')}</div>
                            <div className="flex-grow">{t('leaderboard.agent')}</div>
                            <div className="w-24 text-end">{t('leaderboard.score')}</div>
                        </div>
                        {leaderboardData.map((agent, index) => (
                            <LeaderboardRow 
                                key={agent.userId}
                                rank={index + 1}
                                agent={agent}
                                isCurrentUser={agent.userId === state.userId}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-10 text-[var(--text-muted)]">{t('leaderboard.no_data')}</p>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
