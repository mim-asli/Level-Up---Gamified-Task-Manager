import { AppState, ApiKey, LocalAIConfig, Goal, Task, JournalEntry, Quest, DailyQuestsState, DailyStreak, PomodoroState, OnboardingState, Theme, Language, Reward, RedeemedReward, Skill, Squad, InventoryState, Boost, CacheType } from '../types.js';
import { generateAgentName } from './leaderboard.js';

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

// --- State Validation Type Guards ---
const isApiKey = (item: any): item is ApiKey =>
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.key === 'string' &&
    typeof item.isEnabled === 'boolean';

const isLocalAIConfig = (item: any): item is LocalAIConfig =>
    item &&
    typeof item.url === 'string' &&
    typeof item.apiKey === 'string' &&
    typeof item.modelName === 'string' &&
    typeof item.enabled === 'boolean';


const isGoal = (item: any): item is Goal =>
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.deadline === 'string' &&
    typeof item.dailyTaskDescription === 'string' &&
    typeof item.createdAt === 'string' &&
    typeof item.isActive === 'boolean' &&
    (typeof item.tags === 'undefined' || (Array.isArray(item.tags) && item.tags.every((t: any) => typeof t === 'string')));

const isTask = (item: any): item is Task =>
    item &&
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    typeof item.xp === 'number' &&
    typeof item.completed === 'boolean' &&
    typeof item.createdAt === 'string' && !isNaN(new Date(item.createdAt).getTime()) &&
    (typeof item.dueDate === 'undefined' || (typeof item.dueDate === 'string' && !isNaN(new Date(item.dueDate).getTime()))) &&
    (typeof item.goalId === 'undefined' || typeof item.goalId === 'string') &&
    (typeof item.type === 'undefined' || ['USER_TASK', 'GOAL_TASK', 'QUEST_REWARD', 'LOOT_REWARD'].includes(item.type)) &&
    (typeof item.priority === 'string' && ['low', 'medium', 'high'].includes(item.priority)) &&
    (typeof item.tags === 'undefined' || (Array.isArray(item.tags) && item.tags.every((t: any) => typeof t === 'string'))) &&
    (
        typeof item.rewardDetails === 'undefined' || (
            typeof item.rewardDetails === 'object' && item.rewardDetails !== null &&
            typeof item.rewardDetails.description === 'string'
        )
    );

const isJournalEntry = (item: any): item is JournalEntry =>
    item &&
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    typeof item.createdAt === 'string' && !isNaN(new Date(item.createdAt).getTime()) &&
    (typeof item.tags === 'undefined' || (Array.isArray(item.tags) && item.tags.every((t: any) => typeof t === 'string')));

const isSkill = (item: any): item is Skill => 
    item && typeof item.name === 'string' && typeof item.xp === 'number';

const isSquad = (item: any): item is Squad => 
    item && 
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    Array.isArray(item.members) &&
    typeof item.quest === 'object';

const isQuest = (item: any): item is Quest =>
    item &&
    typeof item.id === 'string' &&
    typeof item.description === 'string' &&
    (typeof item.details === 'undefined' || typeof item.details === 'string') &&
    ['COMPLETE_TASKS', 'EARN_XP', 'WRITE_JOURNAL'].includes(item.type) &&
    typeof item.target === 'number' &&
    typeof item.current === 'number' &&
    typeof item.rewardXp === 'number' &&
    typeof item.claimed === 'boolean';
    
const isReward = (item: any): item is Reward =>
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.cost === 'number' &&
    typeof item.icon === 'string' &&
    typeof item.isOneTime === 'boolean' &&
    typeof item.createdAt === 'string';

const isRedeemedReward = (item: any): item is RedeemedReward =>
    item &&
    typeof item.id === 'string' &&
    typeof item.rewardId === 'string' &&
    typeof item.redeemedAt === 'string';

const isBoost = (item: any): item is Boost =>
    item &&
    typeof item.id === 'string' &&
    item.type === 'XP_BOOST' &&
    typeof item.multiplier === 'number' &&
    typeof item.expiresAt === 'string' && !isNaN(new Date(item.expiresAt).getTime()) &&
    typeof item.source === 'string';

const isInventoryState = (item: any): item is InventoryState =>
    item &&
    typeof item.caches === 'object' &&
    item.caches !== null &&
    typeof item.caches.common === 'number' &&
    Array.isArray(item.boosts) && item.boosts.every(isBoost);

export const validateAndHydrateState = (parsedState: any): AppState => {
    if (!parsedState || typeof parsedState !== 'object') {
        return initialState;
    }
      
    let hasCompletedOnboarding = parsedState.hasCompletedOnboarding;
    if (typeof hasCompletedOnboarding !== 'boolean') {
        if (
            (Array.isArray(parsedState.tasks) && parsedState.tasks.length > 0) ||
            (Array.isArray(parsedState.journalEntries) && parsedState.journalEntries.length > 0) ||
            (Array.isArray(parsedState.goals) && parsedState.goals.length > 0)
        ) {
            hasCompletedOnboarding = true;
        } else {
            hasCompletedOnboarding = false;
        }
    }

    const validatedOnboarding: OnboardingState = (
        parsedState.onboarding &&
        typeof parsedState.onboarding.guideDismissed === 'boolean'
    ) ? parsedState.onboarding : { guideDismissed: hasCompletedOnboarding };

    const validatedDailyQuests: DailyQuestsState = (
        parsedState.dailyQuests &&
        typeof parsedState.dailyQuests.date === 'string' &&
        Array.isArray(parsedState.dailyQuests.quests) &&
        parsedState.dailyQuests.quests.every(isQuest)
    ) ? parsedState.dailyQuests : initialState.dailyQuests;

    const validatedDailyStreak: DailyStreak = (
        parsedState.dailyStreak &&
        typeof parsedState.dailyStreak.current === 'number'
    ) ? parsedState.dailyStreak : initialState.dailyStreak;

    const validatedPomodoro: PomodoroState = (
        parsedState.pomodoro &&
        typeof parsedState.pomodoro.sessions === 'number'
    ) ? parsedState.pomodoro : initialState.pomodoro;
      
    let themeFromStorage = parsedState.theme;
    if (themeFromStorage === 'light') themeFromStorage = 'zen';
    if (themeFromStorage === 'dark') themeFromStorage = 'stealth';
    
    const validatedTheme: Theme = (['hacker', 'stealth', 'zen', 'fantasy'].includes(themeFromStorage))
        ? themeFromStorage : initialState.theme;
        
    const validatedLanguage: Language = (['en', 'fa'].includes(parsedState.language))
        ? parsedState.language : initialState.language;

    const validatedApiKeys = (Array.isArray(parsedState.apiKeys) ? parsedState.apiKeys : [])
      .map((k: any) => {
        if(typeof k.isEnabled !== 'boolean') {
            k.isEnabled = parsedState.activeApiKeyId ? k.id === parsedState.activeApiKeyId : true;
        }
        return k;
      }).filter(isApiKey);

    const validatedLocalAIConfig: LocalAIConfig = isLocalAIConfig(parsedState.localAIConfig) 
        ? parsedState.localAIConfig 
        : initialState.localAIConfig;
        
    const validatedSquad: Squad | null = isSquad(parsedState.squad) ? parsedState.squad : null;
    
    const validatedInventory: InventoryState = isInventoryState(parsedState.inventory)
        ? { ...parsedState.inventory, newCaches: 0 } // Reset transient counter on load
        : initialState.inventory;

    return {
        ...initialState,
        userId: typeof parsedState.userId === 'string' ? parsedState.userId : initialState.userId,
        agentName: typeof parsedState.agentName === 'string' ? parsedState.agentName : initialState.agentName,
        goals: (Array.isArray(parsedState.goals) ? parsedState.goals : []).filter(isGoal),
        tasks: (Array.isArray(parsedState.tasks) ? parsedState.tasks : []).filter(isTask).map(t => ({...t, priority: t.priority || 'medium'})),
        journalEntries: (Array.isArray(parsedState.journalEntries) ? parsedState.journalEntries : []).filter(isJournalEntry),
        skills: (Array.isArray(parsedState.skills) ? parsedState.skills : []).filter(isSkill),
        achievements: (Array.isArray(parsedState.achievements) ? parsedState.achievements : []).filter((ach): ach is string => typeof ach === 'string'),
        achievementImages: (parsedState.achievementImages && typeof parsedState.achievementImages === 'object' && !Array.isArray(parsedState.achievementImages))
            ? Object.fromEntries(Object.entries(parsedState.achievementImages).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
            : initialState.achievementImages,
        dailyQuests: validatedDailyQuests,
        dailyStreak: validatedDailyStreak,
        pomodoro: validatedPomodoro,
        rewards: (Array.isArray(parsedState.rewards) ? parsedState.rewards : []).filter(isReward),
        redeemedRewards: (Array.isArray(parsedState.redeemedRewards) ? parsedState.redeemedRewards : []).filter(isRedeemedReward),
        lastWeeklyReviewDate: typeof parsedState.lastWeeklyReviewDate === 'string' ? parsedState.lastWeeklyReviewDate : null,
        lastAiBriefingDate: typeof parsedState.lastAiBriefingDate === 'string' ? parsedState.lastAiBriefingDate : null,
        theme: validatedTheme,
        language: validatedLanguage,
        soundEnabled: typeof parsedState.soundEnabled === 'boolean' ? parsedState.soundEnabled : initialState.soundEnabled,
        apiKeys: validatedApiKeys,
        lastUsedApiKeyIndex: typeof parsedState.lastUsedApiKeyIndex === 'number' ? parsedState.lastUsedApiKeyIndex : 0,
        localAIConfig: validatedLocalAIConfig,
        hasCompletedOnboarding,
        onboarding: validatedOnboarding,
        squad: validatedSquad,
        inventory: validatedInventory,
        isCommandPaletteOpen: false, // Always start with this closed
    };
};