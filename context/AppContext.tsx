import React, { createContext, useReducer, useEffect, ReactNode, useCallback, useState } from 'react';
import { AppState, Action, AppContextType, Language, Theme } from '../types.js';
import { checkStateBasedAchievements } from '../lib/achievements.js';
import { translations } from '../i18n/index.js';
import get from 'lodash.get';
import { validateAndHydrateState } from '../lib/stateValidation.js';
import { generateAgentName } from '../lib/leaderboard.js';
import { 
  handleTaskAction, 
  handleGoalAction,
  handleJournalAction,
  handleQuestAction,
  handleSettingsAction,
  handleMiscAction,
  handleRewardAction,
  handleSkillAction,
  handleSquadAction,
  handleInventoryAction
} from './reducers/index.js';
import { encrypt, decrypt } from '../lib/crypto.js';

const ENCRYPTED_STATE_KEY = 'levelUpEncryptedData';

const initialState: AppState = {
  userId: crypto.randomUUID(),
  agentName: generateAgentName(),
  goals: [],
  tasks: [],
  journalEntries: [],
  skills: [],
  achievements: [],
  achievementImages: {},
  dailyQuests: { quests: [], date: null },
  dailyStreak: { current: 0, lastCompletionDate: null },
  pomodoro: { sessions: 0, lastSessionDate: null },
  rewards: [],
  redeemedRewards: [],
  lastWeeklyReviewDate: null,
  lastAiBriefingDate: null,
  theme: 'stealth',
  language: 'fa',
  soundEnabled: true,
  apiKeys: [],
  lastUsedApiKeyIndex: 0,
  localAIConfig: {
    url: '',
    apiKey: '',
    modelName: 'mistral-latest',
    enabled: false,
  },
  hasCompletedOnboarding: false,
  onboarding: {
    guideDismissed: false,
  },
  squad: null,
  inventory: {
    caches: { common: 0 },
    boosts: [],
    newCaches: 0,
  },
  isCommandPaletteOpen: false,
};

const loadState = async (masterPassword: string): Promise<AppState> => {
    const encryptedState = localStorage.getItem(ENCRYPTED_STATE_KEY);
    if (!encryptedState) {
        return initialState;
    }
    const decryptedJson = await decrypt(encryptedState, masterPassword);
    const parsedState = JSON.parse(decryptedJson);
    return validateAndHydrateState(parsedState);
};

const saveState = async (state: AppState, masterPassword: string) => {
    try {
        const { isCommandPaletteOpen, ...stateToSave } = state;
        const jsonState = JSON.stringify(stateToSave);
        const encryptedState = await encrypt(jsonState, masterPassword);
        localStorage.setItem(ENCRYPTED_STATE_KEY, encryptedState);
    } catch (err) {
        console.error("Could not save encrypted state:", err);
    }
};


const updateAchievements = (state: AppState): AppState => {
    const stateBasedUnlocked = checkStateBasedAchievements(state);
    const allUnlocked = new Set([...state.achievements, ...stateBasedUnlocked]);
    
    if (allUnlocked.size !== state.achievements.length) {
        return { ...state, achievements: Array.from(allUnlocked).sort() };
    }
    return state;
}

const appReducer = (state: AppState, action: Action): AppState => {
  let tempState: AppState;

  // This root reducer uses a chain of responsibility pattern.
  tempState = handleTaskAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);

  tempState = handleGoalAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);

  tempState = handleJournalAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);
  
  tempState = handleQuestAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);
  
  tempState = handleSettingsAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);
  
  tempState = handleRewardAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);

  tempState = handleSkillAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);
  
  tempState = handleSquadAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);
  
  tempState = handleInventoryAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);

  tempState = handleMiscAction(state, action);
  if (tempState !== state) return updateAchievements(tempState);

  return state;
};


export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode, masterPassword: string }> = ({ children, masterPassword }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  useEffect(() => {
    const initState = async () => {
        try {
            const loadedState = await loadState(masterPassword);
            dispatch({ type: 'REPLACE_STATE', payload: loadedState });
        } catch (error) {
            console.error("Failed to load encrypted state, using initial state.", error);
            // In case of a decryption error on load, we still use the initial (empty) state
        } finally {
            setIsStateLoaded(true);
        }
    };
    initState();
  }, [masterPassword]);


  useEffect(() => {
    if (!isStateLoaded) return;
    const today = new Date().toISOString().slice(0, 10);
    if (state.dailyQuests.date !== today) {
        dispatch({ type: '_INIT_DAILY_STATE' });
    }
  }, [isStateLoaded, state.dailyQuests.date]);

  useEffect(() => {
    if (!isStateLoaded) return;
    saveState(state, masterPassword);
  }, [state, masterPassword, isStateLoaded]);
  
  const t = useCallback((key: string, params?: Record<string, string | number>): any => {
      const lang = state.language;
      const langTranslations = translations[lang];
      const value = get(langTranslations, key, key);

      if (typeof value === 'string') {
          let text = value;
          if (params) {
              Object.entries(params).forEach(([paramKey, paramValue]) => {
                  text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
              });
          }
          return text;
      }
      
      return value;
  }, [state.language]);

  const setLanguage = useCallback((language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: { language } });
  }, []);

  const hasEnabledApiKeys = useCallback((): boolean => {
    return state.apiKeys.some(k => k.isEnabled);
  }, [state.apiKeys]);

  const getNextApiKeyAndRotate = useCallback((): string | null => {
    const enabledKeys = state.apiKeys.filter(k => k.isEnabled);
    if (enabledKeys.length === 0) {
        return null;
    }

    const nextIndex = (state.lastUsedApiKeyIndex + 1) % enabledKeys.length;
    const keyToUse = enabledKeys[nextIndex].key;
    
    dispatch({ type: 'SET_LAST_USED_API_KEY_INDEX', payload: { index: nextIndex }});
    
    return keyToUse;
  }, [state.apiKeys, state.lastUsedApiKeyIndex]);

  if (!isStateLoaded) {
      // Render a loading state until the initial state is loaded and decrypted.
      return (
          <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
          </div>
      );
  }

  return (
    <AppContext.Provider value={{ state, dispatch, t, language: state.language, setLanguage, getNextApiKeyAndRotate, hasEnabledApiKeys }}>
      {children}
    </AppContext.Provider>
  );
};