import { AppState, Action } from '../../types.js';

export function handleSettingsAction(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_THEME': {
            return { ...state, theme: action.payload.theme };
        }
        case 'SET_LANGUAGE': {
            return { ...state, language: action.payload.language };
        }
        case 'TOGGLE_SOUND': {
            return { ...state, soundEnabled: !state.soundEnabled };
        }
        case 'ADD_ACHIEVEMENT_IMAGE': {
            const { achievementId, imageData } = action.payload;
            return {
                ...state,
                achievementImages: {
                    ...state.achievementImages,
                    [achievementId]: imageData
                }
            };
        }
        case 'ADD_API_KEY': {
            return {
                ...state,
                apiKeys: [...state.apiKeys, {
                    id: crypto.randomUUID(),
                    name: action.payload.name,
                    key: action.payload.key,
                    isEnabled: true,
                }],
            };
        }
        case 'DELETE_API_KEY': {
            return {
                ...state,
                apiKeys: state.apiKeys.filter(k => k.id !== action.payload.id),
                lastUsedApiKeyIndex: 0, // Reset index
            };
        }
        case 'TOGGLE_API_KEY_STATUS': {
            return {
                ...state,
                apiKeys: state.apiKeys.map(k =>
                    k.id === action.payload.id ? { ...k, isEnabled: !k.isEnabled } : k
                ),
                lastUsedApiKeyIndex: 0, // Reset index
            };
        }
        case 'SET_LAST_USED_API_KEY_INDEX': {
            return { ...state, lastUsedApiKeyIndex: action.payload.index };
        }
        case 'SET_AGENT_NAME': {
            return { ...state, agentName: action.payload.name };
        }
        case 'SET_LOCAL_AI_CONFIG': {
            return { ...state, localAIConfig: action.payload.config };
        }
        default:
            return state;
    }
}