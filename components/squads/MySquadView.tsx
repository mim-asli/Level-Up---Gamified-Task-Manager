import React, { useMemo, useState, memo } from 'react';
import { Squad, SquadMember } from '../../types.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import Icon from '../Icon.js';
import { useSounds } from '../../hooks/useSounds.js';
import { calculateWeeklyXp } from '../../lib/leaderboard.js';
import ConfirmationModal from '../ConfirmationModal.js';
import { calculatePlayerLevelState } from '../../lib/utils.js';

const MySquadView: React.FC<{ squad: Squad }> = ({ squad }) => {
    const { state, dispatch, t } = useAppContext();
    const play = useSounds();
    const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);

    // Recalculate current user's live data
    const currentUserWeeklyXp = calculateWeeklyXp(state.tasks);
    const { currentLevel } = calculatePlayerLevelState(state.tasks);

    const squadWithLiveData = useMemo(() => {
        let totalXp = 0;
        const members = squad.members.map(member => {
            if (member.isCurrentUser) {
                const liveMember = { ...member, weeklyXp: currentUserWeeklyXp, level: currentLevel };
                totalXp += liveMember.weeklyXp;
                return liveMember;
            }
            totalXp += member.weeklyXp;
            return member;
        }).sort((a,b) => b.weeklyXp - a.weeklyXp);
        
        return { members, totalXp };
    }, [squad.members, currentUserWeeklyXp, currentLevel]);

    const questProgress = Math.min((squadWithLiveData.totalXp / squad.quest.target) * 100, 100);
    const isQuestComplete = questProgress >= 100;

    const handleLeaveSquad = () => {
        play('error');
        dispatch({ type: 'LEAVE_SQUAD' });
        setIsLeaveConfirmOpen(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Vitals and Quest */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Vitals */}
                    <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                        <h2 className="text-xl font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">{t('squads.squad_vitals')}</h2>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                             <h3 className="text-3xl font-bold text-[var(--text-secondary)] font-mono">{squad.name}</h3>
                             <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-[var(--text-primary)] font-mono">{squad.members.length}</p>
                                    <p className="text-sm text-[var(--text-muted)]">{t('squads.members')}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-[var(--text-primary)] font-mono">{squadWithLiveData.totalXp.toLocaleString()}</p>
                                    <p className="text-sm text-[var(--text-muted)]">{t('squads.weekly_xp')}</p>
                                </div>
                             </div>
                        </div>
                    </div>
                    {/* Quest */}
                    <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                        <h2 className="text-xl font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t('squads.weekly_squad_quest')}</h2>
                        <p className="text-[var(--text-secondary)] text-lg font-semibold">{t(squad.quest.descriptionKey, { target: squad.quest.target })}</p>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm font-medium text-[var(--text-muted)] mb-1">
                                <span>{t('squads.quest_progress')}</span>
                                <span className="font-mono">{squadWithLiveData.totalXp.toLocaleString()} / {squad.quest.target.toLocaleString()} XP</span>
                            </div>
                            <div className="w-full bg-[var(--surface-tertiary)] h-4 rounded-none border border-[var(--border-primary)]">
                                <div 
                                    className="bg-[var(--accent-primary)] h-full transition-all duration-500 ease-out" 
                                    style={{ 
                                        width: `${questProgress}%`,
                                        boxShadow: '0 0 10px var(--shadow-accent)'
                                    }}
                                ></div>
                            </div>
                            <p className={`mt-2 text-center font-semibold text-sm transition-opacity ${isQuestComplete ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
                                {t('squads.quest_reward', { xp: squad.quest.rewardXp })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Members and Chat */}
                <div className="space-y-6">
                    {/* Member List */}
                     <div className="bg-[var(--surface-primary)] p-4 rounded-none border border-[var(--border-secondary)]">
                         <h2 className="text-lg font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-2">{t('squads.members')}</h2>
                         <div className="space-y-2 max-h-60 overflow-y-auto">
                            {squadWithLiveData.members.map(member => (
                                <div key={member.userId} className={`flex items-center justify-between p-2 rounded-none ${member.isCurrentUser ? 'bg-[var(--accent-primary)]/20' : 'bg-[var(--surface-secondary)]'}`}>
                                    <div>
                                        <p className="font-semibold text-[var(--text-secondary)]">{member.agentName}</p>
                                        <p className="text-xs text-[var(--text-muted)]">Level {member.level}</p>
                                    </div>
                                    <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">{member.weeklyXp.toLocaleString()} XP</p>
                                </div>
                            ))}
                         </div>
                     </div>
                     {/* Chat */}
                      <div className="bg-[var(--surface-primary)] p-4 rounded-none border border-[var(--border-secondary)]">
                         <h2 className="text-lg font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">{t('squads.squad_chat')}</h2>
                         <div className="h-24 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] p-2 text-sm text-[var(--text-muted)] italic overflow-y-auto">
                            System: Welcome to Squad Comms.
                         </div>
                         <input
                            type="text"
                            placeholder={t('squads.chat_placeholder')}
                            className="w-full bg-[var(--surface-tertiary)] p-2 mt-2 border border-[var(--border-secondary)] focus:border-[var(--border-accent)] focus:outline-none"
                            disabled
                         />
                      </div>
                      <button onClick={() => setIsLeaveConfirmOpen(true)} className="w-full bg-[var(--accent-danger)] hover:bg-[var(--accent-danger-hover)] text-white font-bold py-2 px-4 rounded-none transition-colors flex items-center justify-center gap-2">
                          <Icon name="error" className="w-5 h-5"/>
                          <span>{t('squads.leave_squad')}</span>
                      </button>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isLeaveConfirmOpen}
                onClose={() => setIsLeaveConfirmOpen(false)}
                onConfirm={handleLeaveSquad}
                title={t('squads.leave_squad_confirm_title')}
                message={t('squads.leave_squad_confirm_message')}
            />
        </>
    );
};

export default memo(MySquadView);