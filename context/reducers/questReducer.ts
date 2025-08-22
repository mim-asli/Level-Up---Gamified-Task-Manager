import { AppState, Action, Task } from '../../types.js';
import { getYesterdayISO } from '../../lib/utils.js';

export function handleQuestAction(state: AppState, action: Action): AppState {
    const today = new Date().toISOString().slice(0, 10);
    switch (action.type) {
        case '_INIT_DAILY_STATE': {
            const yesterday = getYesterdayISO();
            let currentStreak = state.dailyStreak.current;
            if (state.dailyQuests.date !== today && state.dailyStreak.lastCompletionDate !== today && state.dailyStreak.lastCompletionDate !== yesterday) {
                currentStreak = 0;
            }
            
            // Activate any goals scheduled to start today
            const goalsWithAutoActivation = state.goals.map(g => {
                if (!g.isActive && g.startsAt && g.startsAt === today) {
                    return { ...g, isActive: true };
                }
                return g;
            });

            let tempState = {
                ...state,
                goals: goalsWithAutoActivation,
                dailyQuests: {
                    quests: [],
                    date: today,
                },
                dailyStreak: {
                    ...state.dailyStreak,
                    current: currentStreak
                }
            };

            const activeGoals = tempState.goals.filter(g => g.isActive && g.deadline && g.deadline >= today && !g.isQuestline && g.dailyTaskDescription);
            const newGeneratedTasks: Task[] = [];
            activeGoals.forEach(goal => {
                const taskExists = tempState.tasks.some(
                    t => t.goalId === goal.id && t.dueDate === today
                );
                if (!taskExists) {
                    newGeneratedTasks.push({
                        id: crypto.randomUUID(),
                        text: goal.dailyTaskDescription!,
                        xp: 15,
                        completed: false,
                        createdAt: new Date().toISOString(),
                        dueDate: today,
                        goalId: goal.id,
                        type: 'GOAL_TASK',
                        priority: 'medium',
                    });
                }
            });

            if (newGeneratedTasks.length > 0) {
                tempState = { ...tempState, tasks: [...newGeneratedTasks, ...tempState.tasks] };
            }
            return tempState;
        }
        case 'SET_DAILY_QUESTS': {
            return {
                ...state,
                dailyQuests: {
                    ...state.dailyQuests,
                    quests: action.payload.quests,
                },
            };
        }
        case 'CLAIM_QUEST_REWARD': {
            const quest = action.payload.quest;
            if (!quest) return state;

            const updatedQuests = state.dailyQuests.quests.map(q =>
                q.id === quest.id ? { ...q, claimed: true } : q
            );

            const questRewardTask: Task = {
                id: crypto.randomUUID(),
                text: 'Quest Reward', // This is placeholder text, the real text is generated in TaskItem
                xp: quest.rewardXp,
                completed: true,
                createdAt: new Date().toISOString(),
                type: 'QUEST_REWARD',
                priority: 'medium',
                rewardDetails: {
                    description: quest.description,
                }
            };
            
            // Guarantee an Intel Cache on quest completion
            const updatedInventory = {
                ...state.inventory,
                caches: {
                    ...state.inventory.caches,
                    common: state.inventory.caches.common + 1,
                },
                newCaches: state.inventory.newCaches + 1,
            };

            return {
                ...state,
                tasks: [questRewardTask, ...state.tasks],
                dailyQuests: {
                    ...state.dailyQuests,
                    quests: updatedQuests,
                },
                inventory: updatedInventory,
            };
        }
        default:
            return state;
    }
}