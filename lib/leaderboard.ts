import moment from 'moment';
import { Task } from '../types.js';

interface AgentData {
    userId: string;
    agentName: string;
    weeklyXp: number;
    streak: number;
    totalXp: number;
}

const prefixes = ["Cipher", "Ghost", "Glitch", "Hex", "Data", "Neon", "Ronin", "Shadow", "Zero", "Proxy", "Net", "Byte"];
const suffixes = ["Runner", "Spectre", "Jolt", "Bender", "Drive", "Wave", "Cat", "Blade", "Heart", "Daemon", "Knight"];

export const generateAgentName = (): string => {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = Math.floor(Math.random() * 99);
    return `${prefix}_${suffix}_${number}`;
}

export const generateFakeLeaderboardData = (currentUser: AgentData): AgentData[] => {
    // Ensure the current user is in the list
    let agents = [currentUser];
    
    // Generate 14 other random agents
    for (let i = 0; i < 14; i++) {
        agents.push({
            userId: crypto.randomUUID(),
            agentName: generateAgentName(),
            weeklyXp: Math.floor(Math.random() * 500) + 50,
            streak: Math.floor(Math.random() * 30),
            totalXp: Math.floor(Math.random() * 10000) + 200,
        });
    }

    // Ensure the fake data has some values higher and lower than the user
    // Add one agent guaranteed to be better
    agents.push({
        userId: crypto.randomUUID(),
        agentName: generateAgentName(),
        weeklyXp: currentUser.weeklyXp + Math.floor(Math.random() * 50) + 10,
        streak: currentUser.streak + Math.floor(Math.random() * 5) + 1,
        totalXp: currentUser.totalXp + Math.floor(Math.random() * 500) + 50,
    });
     // Add one agent guaranteed to be worse
    agents.push({
        userId: crypto.randomUUID(),
        agentName: generateAgentName(),
        weeklyXp: Math.max(0, currentUser.weeklyXp - Math.floor(Math.random() * 50) - 10),
        streak: Math.max(0, currentUser.streak - Math.floor(Math.random() * 5) - 1),
        totalXp: Math.max(0, currentUser.totalXp - Math.floor(Math.random() * 500) - 50),
    });

    // Simple deduplication based on userId
    const uniqueAgents = Array.from(new Map(agents.map(agent => [agent.userId, agent])).values());

    return uniqueAgents;
}


export const calculateWeeklyXp = (tasks: Task[]): number => {
    const oneWeekAgo = moment().subtract(7, 'days');
    return tasks
        .filter(task => task.completed && moment(task.createdAt).isAfter(oneWeekAgo))
        .reduce((sum, task) => sum + task.xp, 0);
};