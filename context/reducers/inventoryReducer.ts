import { AppState, Action, Task, Boost, Loot } from '../../types.js';
import moment from 'moment';

export function handleInventoryAction(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'AWARD_CACHE': {
            const { type } = action.payload;
            return {
                ...state,
                inventory: {
                    ...state.inventory,
                    caches: {
                        ...state.inventory.caches,
                        [type]: (state.inventory.caches[type] || 0) + 1,
                    },
                    newCaches: state.inventory.newCaches + 1,
                }
            };
        }
        case 'OPEN_CACHE': {
            const { cacheType, loot } = action.payload;

            // First, decrement the cache count
            let tempState = {
                ...state,
                inventory: {
                    ...state.inventory,
                    caches: {
                        ...state.inventory.caches,
                        [cacheType]: Math.max(0, (state.inventory.caches[cacheType] || 0) - 1),
                    },
                }
            };

            // Then, apply the loot
            if (loot.type === 'XP') {
                const lootTask: Task = {
                    id: crypto.randomUUID(),
                    text: 'Intel Cache Loot',
                    xp: loot.amount,
                    completed: true,
                    createdAt: new Date().toISOString(),
                    type: 'LOOT_REWARD',
                    priority: 'medium',
                };
                 return { ...tempState, tasks: [lootTask, ...tempState.tasks] };
            } else if (loot.type === 'BOOST') {
                 const newBoost: Boost = {
                    id: crypto.randomUUID(),
                    ...loot.boost,
                };
                return {
                    ...tempState,
                    inventory: {
                        ...tempState.inventory,
                        boosts: [...tempState.inventory.boosts, newBoost],
                    }
                };
            }
            return tempState;
        }
        case 'DISMISS_NEW_CACHE_NOTIFIER': {
            return {
                ...state,
                inventory: {
                    ...state.inventory,
                    newCaches: 0,
                }
            };
        }
        default:
            return state;
    }
}
