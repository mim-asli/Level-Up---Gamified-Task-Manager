import { AppState, Action, Task, Goal } from '../../types.js';
import moment from 'moment';

export function handleGoalAction(state: AppState, action: Action): AppState {
    const today = new Date().toISOString().slice(0, 10);
    switch (action.type) {
        case 'ADD_GOAL': {
            const { name, deadline, dailyTaskDescription, questline, tags, startsAt } = action.payload;
            
            if (questline && questline.steps.length > 0) {
                // It's a questline
                const newQuestlineGoal: Goal = {
                    id: crypto.randomUUID(),
                    name,
                    deadline,
                    dailyTaskDescription: questline.steps[0].text,
                    createdAt: new Date().toISOString(),
                    isActive: true,
                    isQuestline: true,
                    questline: {
                        steps: questline.steps,
                        currentStep: 0,
                    },
                    tags: tags || [],
                };
                
                const firstTask: Task = {
                    id: crypto.randomUUID(),
                    text: questline.steps[0].text,
                    xp: questline.steps[0].xp,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    goalId: newQuestlineGoal.id,
                    type: 'GOAL_TASK',
                    priority: 'high',
                };
                
                return {
                    ...state,
                    goals: [newQuestlineGoal, ...state.goals],
                    tasks: [firstTask, ...state.tasks],
                };
                
            } else {
                 // It's a regular goal
                let tempState = { ...state };
                const newGoal: Goal = {
                    id: crypto.randomUUID(),
                    name,
                    deadline: deadline || undefined,
                    dailyTaskDescription: dailyTaskDescription || undefined,
                    createdAt: new Date().toISOString(),
                    isActive: !startsAt || moment(startsAt).isSameOrBefore(moment(), 'day'),
                    isQuestline: false,
                    tags: tags || [],
                    startsAt: startsAt || undefined,
                };
                tempState = { ...tempState, goals: [newGoal, ...tempState.goals] };

                // Generate the first task immediately if the goal is active and has a daily directive.
                if (newGoal.isActive && newGoal.dailyTaskDescription) {
                    const taskExists = tempState.tasks.some(
                        t => t.goalId === newGoal.id && t.dueDate === today
                    );
                    if (!taskExists) {
                        const newTask: Task = {
                            id: crypto.randomUUID(),
                            text: newGoal.dailyTaskDescription,
                            xp: 15,
                            completed: false,
                            createdAt: new Date().toISOString(),
                            dueDate: today,
                            goalId: newGoal.id,
                            type: 'GOAL_TASK',
                            priority: 'medium',
                        };
                        tempState.tasks = [newTask, ...tempState.tasks];
                    }
                }
                return tempState;
            }
        }
        case 'TOGGLE_GOAL_STATUS': {
            return {
                ...state,
                goals: state.goals.map(g =>
                    g.id === action.payload.id ? { ...g, isActive: !g.isActive } : g
                ),
            };
        }
        case 'EDIT_GOAL': {
             const { id, ...updates } = action.payload;
            return {
                ...state,
                goals: state.goals.map(g => {
                    if (g.id === id) {
                        const newGoal = { ...g, ...updates };
                        if (updates.deadline === '') newGoal.deadline = undefined;
                        if (updates.startsAt === '') newGoal.startsAt = undefined;
                        if (updates.dailyTaskDescription === '') newGoal.dailyTaskDescription = undefined;
                        return newGoal;
                    }
                    return g;
                })
            };
        }
        case 'DELETE_GOAL': {
            const goalIdToDelete = action.payload.id;
            return {
                ...state,
                goals: state.goals.filter(g => g.id !== goalIdToDelete),
                tasks: state.tasks.filter(t => t.goalId !== goalIdToDelete),
            };
        }
        default:
            return state;
    }
}