import { AppState, Action } from '../../types.js';

export function handleMiscAction(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'REPLACE_STATE': {
            // The payload is validated before dispatching, so we can trust it.
            return action.payload;
        }
        case 'COMPLETE_POMODORO_SESSION': {
            const todayStr = new Date().toISOString().slice(0, 10);
            let sessionsToday = state.pomodoro.lastSessionDate === todayStr ? state.pomodoro.sessions : 0;
            
            return { 
                ...state, 
                pomodoro: {
                    sessions: sessionsToday + 1,
                    lastSessionDate: todayStr,
                }
            };
        }
        case 'SET_LAST_WEEKLY_REVIEW_DATE': {
            return { ...state, lastWeeklyReviewDate: action.payload.date };
        }
        case 'SET_AI_BRIEFING_DATE': {
            return { ...state, lastAiBriefingDate: action.payload.date };
        }
        case 'COMPLETE_ONBOARDING': {
            return { ...state, hasCompletedOnboarding: true };
        }
        case 'DISMISS_ONBOARDING_GUIDE': {
            return { 
                ...state, 
                onboarding: { ...state.onboarding, guideDismissed: true }
            };
        }
        case 'TOGGLE_COMMAND_PALETTE': {
            return { ...state, isCommandPaletteOpen: !state.isCommandPaletteOpen };
        }
        case 'CLOSE_COMMAND_PALETTE': {
            return { ...state, isCommandPaletteOpen: false };
        }
        default:
            return state;
    }
}