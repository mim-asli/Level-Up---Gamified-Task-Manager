import React from 'react';
import { IconName } from './components/Icon.js';
import { NavigateFunction } from 'react-router-dom';

export interface Goal {
  id: string;
  name: string;
  deadline?: string; // ISO date YYYY-MM-DD
  dailyTaskDescription?: string;
  createdAt: string; // ISO string
  isActive: boolean;
  isQuestline?: boolean;
  questline?: {
    steps: { text: string; xp: number }[];
    currentStep: number;
  };
  tags?: string[];
  startsAt?: string; // ISO date YYYY-MM-DD
}

export type TaskType = 'USER_TASK' | 'QUEST_REWARD' | 'GOAL_TASK' | 'LOOT_REWARD';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  xp: number;
  completed: boolean;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
  dueDate?: string; // ISO string (YYYY-MM-DD)
  goalId?: string; // Link to a Goal
  type?: TaskType;
  priority: TaskPriority;
  rewardDetails?: {
    description: string;
  };
  subTasks?: SubTask[];
  tags?: string[];
}

export interface JournalEntry {
  id: string;
  text: string;
  createdAt: string; // ISO string
  tags?: string[];
}

export interface Achievement {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: IconName;
}

export interface Quest {
  id: string;
  description: string;
  details?: string;
  type: 'COMPLETE_TASKS' | 'EARN_XP' | 'WRITE_JOURNAL';
  target: number;
  current: number;
  rewardXp: number;
  claimed: boolean;
}

export interface DailyQuestsState {
  quests: Quest[];
  date: string | null;
}

export interface DailyStreak {
    current: number;
    lastCompletionDate: string | null;
}

export interface PomodoroState {
    sessions: number;
    lastSessionDate: string | null;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: IconName;
  isOneTime: boolean;
  createdAt: string; // ISO string
}

export interface RedeemedReward {
  id: string;
  rewardId: string;
  redeemedAt: string; // ISO string
}

export type Theme = 'hacker' | 'stealth' | 'zen' | 'fantasy';
export type Language = 'en' | 'fa';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  isEnabled: boolean;
}

export interface LocalAIConfig {
  url: string;
  apiKey: string;
  modelName: string;
  enabled: boolean;
}

export interface OnboardingState {
  guideDismissed: boolean;
}

export interface Skill {
  name: string; // The tag name
  xp: number;
}

export interface SquadMember {
    userId: string;
    agentName: string;
    level: number;
    weeklyXp: number;
    isCurrentUser: boolean;
}

export interface SquadQuest {
    id: string;
    descriptionKey: string;
    target: number;
    rewardXp: number;
}

export interface Squad {
    id: string;
    name: string;
    members: SquadMember[];
    quest: SquadQuest;
}

export type CacheType = 'common'; // Can be expanded later

export interface Boost {
    id: string;
    type: 'XP_BOOST';
    multiplier: number; // e.g., 1.25 for +25%
    expiresAt: string; // ISO string
    source: string; // e.g., 'common_cache'
}

export interface InventoryState {
    caches: Record<CacheType, number>;
    boosts: Boost[];
    newCaches: number; // A transient counter for the notifier
}

export type Loot = { type: 'XP', amount: number } | { type: 'BOOST', boost: Omit<Boost, 'id'> };


export interface AppState {
  userId: string;
  agentName: string;
  goals: Goal[];
  tasks: Task[];
  journalEntries: JournalEntry[];
  skills: Skill[];
  achievements: string[];
  achievementImages: Record<string, string>; // achievementId -> base64 image data
  dailyQuests: DailyQuestsState;
  dailyStreak: DailyStreak;
  pomodoro: PomodoroState;
  rewards: Reward[];
  redeemedRewards: RedeemedReward[];
  lastWeeklyReviewDate: string | null;
  lastAiBriefingDate: string | null;
  theme: Theme;
  language: Language;
  soundEnabled: boolean;
  apiKeys: ApiKey[];
  lastUsedApiKeyIndex: number;
  localAIConfig: LocalAIConfig;
  hasCompletedOnboarding: boolean;
  onboarding: OnboardingState;
  squad: Squad | null;
  inventory: InventoryState;
  isCommandPaletteOpen: boolean;
}

export type Action =
  | { type: 'ADD_TASK'; payload: { text: string; dueDate?: string; priority: TaskPriority; tags?: string[] } }
  | { type: 'TOGGLE_TASK_STATUS'; payload: { id: string; xp: number } }
  | { type: 'EDIT_TASK'; payload: { id: string; text: string; priority: TaskPriority } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'ADD_SUB_TASK'; payload: { taskId: string; text: string } }
  | { type: 'TOGGLE_SUB_TASK'; payload: { taskId: string; subTaskId: string } }
  | { type: 'DELETE_SUB_TASK'; payload: { taskId: string; subTaskId: string } }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: { text: string; tags?: string[] } }
  | { type: 'ADD_AI_TASKS'; payload: { tasks: string[] } }
  | { type: 'ADD_GOAL'; payload: { name: string; deadline?: string; dailyTaskDescription?: string; questline?: { steps: { text: string; xp: number }[] }; tags?: string[]; startsAt?: string } }
  | { type: 'TOGGLE_GOAL_STATUS'; payload: { id:string } }
  | { type: 'EDIT_GOAL'; payload: { id: string; name: string; deadline?: string; dailyTaskDescription?: string; startsAt?: string } }
  | { type: 'DELETE_GOAL'; payload: { id: string } }
  | { type: 'ADD_SKILL'; payload: { name: string } }
  | { type: '_INIT_DAILY_STATE' }
  | { type: 'SET_DAILY_QUESTS'; payload: { quests: Quest[] } }
  | { type: 'CLAIM_QUEST_REWARD'; payload: { quest: Quest } }
  | { type: 'COMPLETE_POMODORO_SESSION' }
  | { type: 'ADD_REWARD'; payload: { name: string; cost: number; icon: IconName; isOneTime: boolean } }
  | { type: 'DELETE_REWARD'; payload: { id: string } }
  | { type: 'REDEEM_REWARD'; payload: { reward: Reward } }
  | { type: 'SET_LAST_WEEKLY_REVIEW_DATE'; payload: { date: string } }
  | { type: 'SET_THEME'; payload: { theme: Theme } }
  | { type: 'SET_LANGUAGE'; payload: { language: Language } }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'ADD_ACHIEVEMENT_IMAGE'; payload: { achievementId: string, imageData: string } }
  | { type: 'ADD_API_KEY'; payload: { name: string; key: string } }
  | { type: 'DELETE_API_KEY'; payload: { id: string } }
  | { type: 'TOGGLE_API_KEY_STATUS'; payload: { id: string } }
  | { type: 'SET_LAST_USED_API_KEY_INDEX'; payload: { index: number } }
  | { type: 'SET_AGENT_NAME'; payload: { name: string } }
  | { type: 'SET_AI_BRIEFING_DATE'; payload: { date: string } }
  | { type: 'SET_LOCAL_AI_CONFIG'; payload: { config: LocalAIConfig } }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'DISMISS_ONBOARDING_GUIDE' }
  | { type: 'CREATE_SQUAD'; payload: { name: string } }
  | { type: 'LEAVE_SQUAD' }
  | { type: 'AWARD_CACHE'; payload: { type: CacheType } }
  | { type: 'OPEN_CACHE'; payload: { cacheType: CacheType; loot: Loot } }
  | { type: 'DISMISS_NEW_CACHE_NOTIFIER' }
  | { type: 'TOGGLE_COMMAND_PALETTE' }
  | { type: 'CLOSE_COMMAND_PALETTE' }
  | { type: 'REPLACE_STATE'; payload: AppState };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  t: (key: string, params?: Record<string, string | number>) => any;
  language: Language;
  setLanguage: (language: Language) => void;
  getNextApiKeyAndRotate: () => string | null;
  hasEnabledApiKeys: () => boolean;
}

export interface CommandContext {
    dispatch: React.Dispatch<Action>;
    navigate: NavigateFunction;
    state: AppState;
    t: (key: string, params?: Record<string, string | number>) => any;
}

export interface Command {
    id: string;
    title: string; // Translation key
    description: string; // Translation key
    icon: IconName;
    section?: string; // Translation key. If present, shown in palette.
    hotkey?: string; // e.g. 'mod+k'
    action: (context: CommandContext) => void;
}