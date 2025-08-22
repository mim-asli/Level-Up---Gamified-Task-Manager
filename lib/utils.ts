import { Task, Reward, RedeemedReward } from '../types.js';

export const XP_PER_LEVEL_BASE = 25;
export const XP_PER_SKILL_BASE = 15;

export const calculatePlayerLevelState = (tasks: Task[]) => {
  const totalEarnedXp = tasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.xp, 0);
  
  const currentLevel = Math.floor(Math.sqrt(totalEarnedXp / XP_PER_LEVEL_BASE)) + 1;
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * XP_PER_LEVEL_BASE;
  const xpForNextLevel = Math.pow(currentLevel, 2) * XP_PER_LEVEL_BASE;
  
  const xpIntoCurrentLevel = totalEarnedXp - xpForCurrentLevel;
  const xpNeededForLevelUp = xpForNextLevel - xpForCurrentLevel;
  
  const progressPercentage = xpNeededForLevelUp > 0 ? (xpIntoCurrentLevel / xpNeededForLevelUp) * 100 : 100;

  return {
    totalEarnedXp,
    currentLevel,
    progressPercentage,
    xpIntoCurrentLevel,
    xpNeededForLevelUp,
  };
};

export const calculateSkillLevelState = (xp: number) => {
  if (xp <= 0) {
    return {
      currentLevel: 1,
      progressPercentage: 0,
      xpIntoCurrentLevel: 0,
      xpNeededForLevelUp: XP_PER_SKILL_BASE,
    };
  }
  const currentLevel = Math.floor(Math.sqrt(xp / XP_PER_SKILL_BASE)) + 1;
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * XP_PER_SKILL_BASE;
  const xpForNextLevel = Math.pow(currentLevel, 2) * XP_PER_SKILL_BASE;

  const xpIntoCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForLevelUp = xpForNextLevel - xpForCurrentLevel;

  const progressPercentage = xpNeededForLevelUp > 0 ? (xpIntoCurrentLevel / xpNeededForLevelUp) * 100 : 100;

  return {
    currentLevel,
    progressPercentage,
    xpIntoCurrentLevel,
    xpNeededForLevelUp,
  };
};

export const calculateXpState = (tasks: Task[], rewards: Reward[], redeemedRewards: RedeemedReward[]) => {
    const { totalEarnedXp } = calculatePlayerLevelState(tasks);

    const totalSpentXp = redeemedRewards.reduce((sum, redeemed) => {
        const reward = rewards.find(r => r.id === redeemed.rewardId);
        return sum + (reward ? reward.cost : 0);
    }, 0);

    const spendableXp = totalEarnedXp - totalSpentXp;

    return {
        totalEarnedXp,
        totalSpentXp,
        spendableXp,
    };
};

export const isISODateToday = (dateString: string): boolean => {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return false;
  }
  const taskDate = new Date(dateString).toISOString().slice(0, 10);
  const todayDate = new Date().toISOString().slice(0, 10);
  return taskDate === todayDate;
};

export const getYesterdayISO = (): string => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
};