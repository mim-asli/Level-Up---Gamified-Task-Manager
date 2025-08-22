import { AppState, Action, Task, SubTask } from '../../types.js';
import { ACHIEVEMENT_IDS } from '../../lib/achievements.js';
import { getYesterdayISO } from '../../lib/utils.js';
import moment from 'moment';

export function handleTaskAction(state: AppState, action: Action): AppState {
    const today = new Date().toISOString().slice(0, 10);
    switch (action.type) {
        case 'ADD_TASK': {
            const { text, dueDate, priority, tags } = action.payload;
            const newTask: Task = {
                id: crypto.randomUUID(),
                text: text,
                xp: [10, 20, 30][Math.floor(Math.random() * 3)],
                completed: false,
                createdAt: new Date().toISOString(),
                dueDate,
                type: 'USER_TASK',
                priority,
                tags: tags || [],
            };
            return { ...state, tasks: [newTask, ...state.tasks] };
        }
        case 'TOGGLE_TASK_STATUS': {
            let toggledTask: Task | undefined;
            const updatedTasks = state.tasks.map((task) => {
                if (task.id === action.payload.id) {
                    const isCompleting = !task.completed;
                    toggledTask = { 
                        ...task, 
                        completed: isCompleting, 
                        completedAt: isCompleting ? new Date().toISOString() : undefined 
                    };
                    return toggledTask;
                }
                return task;
            });
            
            if (!toggledTask) return state;

            let tempState = { ...state, tasks: updatedTasks };

            // Apply active boosts
            const activeBoost = tempState.inventory.boosts.find(b => moment().isBefore(b.expiresAt));
            const xpFromTask = toggledTask.xp * (activeBoost ? activeBoost.multiplier : 1);

            // Handle Skill XP updates
            const xpChange = toggledTask.completed ? xpFromTask : -xpFromTask;
            const tags = toggledTask.tags || [];

            if (tags.length > 0) {
                let skillsMap = new Map(tempState.skills.map(s => [s.name, s]));
                
                tags.forEach(tag => {
                    const existingSkill = skillsMap.get(tag);
                    if (existingSkill) {
                        skillsMap.set(tag, { ...existingSkill, xp: Math.max(0, existingSkill.xp + xpChange) });
                    } else if (toggledTask!.completed) { // Only create new skills on completion, not un-completion
                        skillsMap.set(tag, { name: tag, xp: xpChange });
                    }
                });

                tempState = { ...tempState, skills: Array.from(skillsMap.values()) };
            }

            // Handle Streak, Quests, Questline updates, and Cache awards only on task completion
            if (toggledTask.completed) {
                // --- Daily Streak & Quests Update ---
                let newStreak = tempState.dailyStreak.current;
                if (tempState.dailyStreak.lastCompletionDate !== today) {
                    const yesterday = getYesterdayISO();
                    newStreak = tempState.dailyStreak.lastCompletionDate === yesterday ? tempState.dailyStreak.current + 1 : 1;
                }
                const updatedStreak = { current: newStreak, lastCompletionDate: today };

                const updatedQuests = tempState.dailyQuests.quests.map(q => {
                    if (q.claimed) return q;
                    const newQuest = { ...q };
                    if (newQuest.type === 'COMPLETE_TASKS') {
                        newQuest.current += 1;
                    } else if (newQuest.type === 'EARN_XP') {
                        newQuest.current += xpFromTask;
                    }
                    return newQuest;
                });
                
                tempState = {
                    ...tempState,
                    dailyStreak: updatedStreak,
                    dailyQuests: { ...tempState.dailyQuests, quests: updatedQuests },
                };
                
                // --- Award Intel Cache ---
                const priorityChance = { low: 0.05, medium: 0.1, high: 0.2 };
                if (Math.random() < priorityChance[toggledTask.priority]) {
                    tempState.inventory = {
                        ...tempState.inventory,
                        caches: {
                            ...tempState.inventory.caches,
                            common: tempState.inventory.caches.common + 1,
                        },
                        newCaches: tempState.inventory.newCaches + 1,
                    };
                }
                
                // --- Questline Progression ---
                if (toggledTask.goalId) {
                    const parentGoal = tempState.goals.find(g => g.id === toggledTask!.goalId);
                    if (parentGoal && parentGoal.isQuestline && parentGoal.questline) {
                        const goalIndex = tempState.goals.findIndex(g => g.id === parentGoal.id);
                        if (goalIndex > -1) {
                            const updatedQuestlineState = {
                                ...parentGoal.questline,
                                currentStep: parentGoal.questline.currentStep + 1,
                            };
                
                            let updatedGoal = { ...parentGoal, questline: updatedQuestlineState };
                            let newTasksToAdd: Task[] = [];
                
                            if (updatedQuestlineState.currentStep < updatedQuestlineState.steps.length) {
                                const nextStep = updatedQuestlineState.steps[updatedQuestlineState.currentStep];
                                newTasksToAdd.push({
                                    id: crypto.randomUUID(),
                                    text: nextStep.text,
                                    xp: nextStep.xp,
                                    completed: false,
                                    createdAt: new Date().toISOString(),
                                    goalId: parentGoal.id,
                                    type: 'GOAL_TASK',
                                    priority: 'high',
                                });
                            } else {
                                updatedGoal = { ...updatedGoal, isActive: false };
                            }
                            
                            const updatedGoals = [...tempState.goals];
                            updatedGoals[goalIndex] = updatedGoal;
                            
                            tempState = {
                                ...tempState,
                                goals: updatedGoals,
                                tasks: [...newTasksToAdd, ...tempState.tasks],
                            };
                        }
                    }
                }
            }
            return tempState;
        }
        case 'ADD_AI_TASKS': {
            const newTasks: Task[] = action.payload.tasks.map(text => ({
                id: crypto.randomUUID(),
                text: text,
                xp: [10, 20, 30][Math.floor(Math.random() * 3)],
                completed: false,
                createdAt: new Date().toISOString(),
                type: 'USER_TASK',
                priority: 'medium',
            }));
            
            const updatedAchievements = new Set(state.achievements);
            updatedAchievements.add(ACHIEVEMENT_IDS.AI_ASSIST);
          
            return {
                ...state,
                tasks: [...newTasks, ...state.tasks],
                achievements: Array.from(updatedAchievements),
            };
        }
        case 'EDIT_TASK': {
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id
                        ? { ...task, text: action.payload.text, priority: action.payload.priority }
                        : task
                )
            };
        }
        case 'DELETE_TASK': {
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload.id)
            };
        }
        case 'ADD_SUB_TASK': {
            const { taskId, text } = action.payload;
            return {
                ...state,
                tasks: state.tasks.map(task => {
                    if (task.id === taskId) {
                        const newSubTask: SubTask = { id: crypto.randomUUID(), text, completed: false };
                        return { ...task, subTasks: [...(task.subTasks || []), newSubTask] };
                    }
                    return task;
                })
            };
        }
        case 'TOGGLE_SUB_TASK': {
            const { taskId, subTaskId } = action.payload;
            let parentTaskCompleted = false;
            let parentTask: Task | undefined;

            const updatedTasks = state.tasks.map(task => {
                if (task.id === taskId) {
                    const updatedSubTasks = (task.subTasks || []).map(st =>
                        st.id === subTaskId ? { ...st, completed: !st.completed } : st
                    );
                    
                    const allSubTasksComplete = updatedSubTasks.every(st => st.completed);
                    
                    if (allSubTasksComplete && !task.completed) {
                        parentTaskCompleted = true;
                        parentTask = task;
                    }
                    
                    return { 
                        ...task, 
                        subTasks: updatedSubTasks, 
                        completed: allSubTasksComplete,
                        completedAt: allSubTasksComplete ? (task.completedAt || new Date().toISOString()) : undefined
                    };
                }
                return task;
            });
            
            let tempState = { ...state, tasks: updatedTasks };

            // If the parent task was just auto-completed, trigger the associated side effects
            if (parentTaskCompleted && parentTask) {
                let newStreak = tempState.dailyStreak.current;
                if (tempState.dailyStreak.lastCompletionDate !== today) {
                    const yesterday = getYesterdayISO();
                    newStreak = tempState.dailyStreak.lastCompletionDate === yesterday ? tempState.dailyStreak.current + 1 : 1;
                }
                 tempState.dailyStreak = { current: newStreak, lastCompletionDate: today };
                
                 tempState.dailyQuests.quests = tempState.dailyQuests.quests.map(q => {
                    if (q.claimed) return q;
                    if (q.type === 'COMPLETE_TASKS') q.current += 1;
                    if (q.type === 'EARN_XP') q.current += parentTask!.xp;
                    return q;
                });
            }

            return tempState;
        }
        case 'DELETE_SUB_TASK': {
            const { taskId, subTaskId } = action.payload;
            return {
                ...state,
                tasks: state.tasks.map(task => {
                    if (task.id === taskId) {
                         return { ...task, subTasks: (task.subTasks || []).filter(st => st.id !== subTaskId) };
                    }
                    return task;
                })
            }
        }
        case 'OPEN_CACHE': {
            if (action.payload.loot.type === 'XP') {
                const lootTask: Task = {
                    id: crypto.randomUUID(),
                    text: 'Intel Cache Loot',
                    xp: action.payload.loot.amount,
                    completed: true,
                    createdAt: new Date().toISOString(),
                    type: 'LOOT_REWARD',
                    priority: 'medium',
                };
                return { ...state, tasks: [lootTask, ...state.tasks] };
            }
            return state;
        }
        default:
            return state;
    }
}