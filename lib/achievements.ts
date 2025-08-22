import { AppState, Achievement } from '../types.js';
import { calculatePlayerLevelState } from './utils.js';

export const ACHIEVEMENT_IDS = {
  FIRST_BLOOD: 'FIRST_BLOOD',
  APPRENTICE: 'APPRENTICE',
  JOURNEYMAN: 'JOURNEYMAN',
  SCRIBE: 'SCRIBE',
  HISTORIAN: 'HISTORIAN',
  LEVEL_5: 'LEVEL_5',
  LEVEL_10: 'LEVEL_10',
  AI_ASSIST: 'AI_ASSIST',
  PERSISTENT: 'PERSISTENT',
  MASTER: 'MASTER',
  FIRE_STARTER: 'FIRE_STARTER',
  DEEP_WORK: 'DEEP_WORK',
  GOAL_SETTER: 'GOAL_SETTER',
  QUEST_HUNTER: 'QUEST_HUNTER',
};

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'name' | 'description'>[] = [
  {
    id: ACHIEVEMENT_IDS.FIRST_BLOOD,
    nameKey: 'achievements.FIRST_BLOOD.name',
    descriptionKey: 'achievements.FIRST_BLOOD.description',
    icon: 'check',
  },
  {
    id: ACHIEVEMENT_IDS.APPRENTICE,
    nameKey: 'achievements.APPRENTICE.name',
    descriptionKey: 'achievements.APPRENTICE.description',
    icon: 'tasks',
  },
  {
    id: ACHIEVEMENT_IDS.JOURNEYMAN,
    nameKey: 'achievements.JOURNEYMAN.name',
    descriptionKey: 'achievements.JOURNEYMAN.description',
    icon: 'tasks',
  },
   {
    id: ACHIEVEMENT_IDS.PERSISTENT,
    nameKey: 'achievements.PERSISTENT.name',
    descriptionKey: 'achievements.PERSISTENT.description',
    icon: 'tasks',
  },
    {
    id: ACHIEVEMENT_IDS.SCRIBE,
    nameKey: 'achievements.SCRIBE.name',
    descriptionKey: 'achievements.SCRIBE.description',
    icon: 'journal',
  },
  {
    id: ACHIEVEMENT_IDS.HISTORIAN,
    nameKey: 'achievements.HISTORIAN.name',
    descriptionKey: 'achievements.HISTORIAN.description',
    icon: 'journal',
  },
  {
    id: ACHIEVEMENT_IDS.LEVEL_5,
    nameKey: 'achievements.LEVEL_5.name',
    descriptionKey: 'achievements.LEVEL_5.description',
    icon: 'xp',
  },
  {
    id: ACHIEVEMENT_IDS.LEVEL_10,
    nameKey: 'achievements.LEVEL_10.name',
    descriptionKey: 'achievements.LEVEL_10.description',
    icon: 'xp',
  },
   {
    id: ACHIEVEMENT_IDS.MASTER,
    nameKey: 'achievements.MASTER.name',
    descriptionKey: 'achievements.MASTER.description',
    icon: 'xp',
  },
  {
    id: ACHIEVEMENT_IDS.AI_ASSIST,
    nameKey: 'achievements.AI_ASSIST.name',
    descriptionKey: 'achievements.AI_ASSIST.description',
    icon: 'sparkle',
  },
  {
    id: ACHIEVEMENT_IDS.FIRE_STARTER,
    nameKey: 'achievements.FIRE_STARTER.name',
    descriptionKey: 'achievements.FIRE_STARTER.description',
    icon: 'fire',
  },
  {
    id: ACHIEVEMENT_IDS.DEEP_WORK,
    nameKey: 'achievements.DEEP_WORK.name',
    descriptionKey: 'achievements.DEEP_WORK.description',
    icon: 'timer',
  },
  {
    id: ACHIEVEMENT_IDS.GOAL_SETTER,
    nameKey: 'achievements.GOAL_SETTER.name',
    descriptionKey: 'achievements.GOAL_SETTER.description',
    icon: 'goal',
  },
  {
    id: ACHIEVEMENT_IDS.QUEST_HUNTER,
    nameKey: 'achievements.QUEST_HUNTER.name',
    descriptionKey: 'achievements.QUEST_HUNTER.description',
    icon: 'calendar',
  },
];

export const checkStateBasedAchievements = (state: AppState): string[] => {
    const unlocked = new Set<string>();
    const completedTasksCount = state.tasks.filter(t => t.completed).length;

    if (completedTasksCount >= 1) unlocked.add(ACHIEVEMENT_IDS.FIRST_BLOOD);
    if (completedTasksCount >= 10) unlocked.add(ACHIEVEMENT_IDS.APPRENTICE);
    if (completedTasksCount >= 50) unlocked.add(ACHIEVEMENT_IDS.JOURNEYMAN);
    if (completedTasksCount >= 100) unlocked.add(ACHIEVEMENT_IDS.PERSISTENT);

    if (state.journalEntries.length >= 1) unlocked.add(ACHIEVEMENT_IDS.SCRIBE);
    if (state.journalEntries.length >= 5) unlocked.add(ACHIEVEMENT_IDS.HISTORIAN);

    const { currentLevel } = calculatePlayerLevelState(state.tasks);
    if (currentLevel >= 5) unlocked.add(ACHIEVEMENT_IDS.LEVEL_5);
    if (currentLevel >= 10) unlocked.add(ACHIEVEMENT_IDS.LEVEL_10);
    if (currentLevel >= 25) unlocked.add(ACHIEVEMENT_IDS.MASTER);
    
    if (state.dailyStreak.current >= 7) unlocked.add(ACHIEVEMENT_IDS.FIRE_STARTER);

    if (state.pomodoro.sessions >= 4) {
        unlocked.add(ACHIEVEMENT_IDS.DEEP_WORK);
    }
    
    if (state.goals.length >= 1) unlocked.add(ACHIEVEMENT_IDS.GOAL_SETTER);
    
    if (state.dailyQuests.quests.some(q => q.claimed)) {
        unlocked.add(ACHIEVEMENT_IDS.QUEST_HUNTER);
    }

    return Array.from(unlocked);
};