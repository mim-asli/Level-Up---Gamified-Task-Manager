import { AppState, Action, Reward, RedeemedReward } from '../../types.js';
import { calculateXpState } from '../../lib/utils.js';

export function handleRewardAction(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'ADD_REWARD': {
            const newReward: Reward = {
                id: crypto.randomUUID(),
                ...action.payload,
                cost: Math.abs(action.payload.cost),
                createdAt: new Date().toISOString(),
            };
            return {
                ...state,
                rewards: [...state.rewards, newReward].sort((a,b) => a.cost - b.cost),
            };
        }
        case 'DELETE_REWARD': {
            return {
                ...state,
                rewards: state.rewards.filter(r => r.id !== action.payload.id),
            };
        }
        case 'REDEEM_REWARD': {
            const { reward } = action.payload;
            const { spendableXp } = calculateXpState(state.tasks, state.rewards, state.redeemedRewards);

            // Check if it's a one-time reward that has already been redeemed
            const isAlreadyRedeemed = reward.isOneTime && state.redeemedRewards.some(r => r.rewardId === reward.id);

            if (spendableXp >= reward.cost && !isAlreadyRedeemed) {
                const newRedemption: RedeemedReward = {
                    id: crypto.randomUUID(),
                    rewardId: reward.id,
                    redeemedAt: new Date().toISOString(),
                };
                return {
                    ...state,
                    redeemedRewards: [newRedemption, ...state.redeemedRewards],
                };
            }
            return state; // Not enough XP or already redeemed, do nothing
        }
        default:
            return state;
    }
}
