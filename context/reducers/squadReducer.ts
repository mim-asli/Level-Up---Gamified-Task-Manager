import { AppState, Action, Squad, SquadMember } from '../../types.js';
import { generateAgentName } from '../../lib/leaderboard.js';
import { calculatePlayerLevelState } from '../../lib/utils.js';
import { calculateWeeklyXp } from '../../lib/leaderboard.js';

const SQUAD_QUESTS = [
    { id: 'SQ1', descriptionKey: 'squads.quest_desc_xp', target: 5000, rewardXp: 250 },
    { id: 'SQ2', descriptionKey: 'squads.quest_desc_tasks', target: 25, rewardXp: 300 },
];

const createFakeMembers = (): SquadMember[] => {
    const members: SquadMember[] = [];
    for (let i = 0; i < 3; i++) {
        members.push({
            userId: crypto.randomUUID(),
            agentName: generateAgentName(),
            level: Math.floor(Math.random() * 20) + 5,
            weeklyXp: Math.floor(Math.random() * 1500) + 200,
            isCurrentUser: false,
        });
    }
    return members;
};

export function handleSquadAction(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'CREATE_SQUAD': {
            if (state.squad) return state; // Already in a squad

            const { currentLevel } = calculatePlayerLevelState(state.tasks);
            const weeklyXp = calculateWeeklyXp(state.tasks);

            const currentUserMember: SquadMember = {
                userId: state.userId,
                agentName: state.agentName,
                level: currentLevel,
                weeklyXp: weeklyXp, // This is a snapshot, UI will show live data
                isCurrentUser: true,
            };

            const newSquad: Squad = {
                id: crypto.randomUUID(),
                name: action.payload.name,
                members: [currentUserMember, ...createFakeMembers()],
                quest: SQUAD_QUESTS[Math.floor(Math.random() * SQUAD_QUESTS.length)],
            };
            return { ...state, squad: newSquad };
        }
        
        case 'LEAVE_SQUAD': {
            return { ...state, squad: null };
        }

        default:
            return state;
    }
}
