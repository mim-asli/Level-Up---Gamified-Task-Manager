import { Type, GenerateContentResponse } from '@google/genai';
import { Quest, Task } from '../types.js';

const questSchema = {
    type: Type.OBJECT,
    properties: {
        quests: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    description: {
                        type: Type.STRING,
                        description: 'The thematic text for the quest, e.g., "Debug 3 legacy code modules (complete 3 tasks)."',
                    },
                    details: {
                        type: Type.STRING,
                        description: 'A short, encouraging tip, e.g., "These have been on the back-burner. Time to clear the queue."',
                    },
                    type: {
                        type: Type.STRING,
                        enum: ['COMPLETE_TASKS', 'EARN_XP', 'WRITE_JOURNAL'],
                    },
                    target: {
                        type: Type.NUMBER,
                        description: 'The goal number for the quest type.',
                    },
                    rewardXp: {
                        type: Type.NUMBER,
                        description: 'A reasonable XP reward, e.g., 20-80, based on difficulty.',
                    }
                },
                required: ["description", "details", "type", "target", "rewardXp"]
            }
        }
    },
    required: ["quests"]
};


export const generateDailyQuests = async (
    tasks: Task[],
    generateContent: (params: any) => Promise<GenerateContentResponse>,
    language: string,
    t: (key: string, params?: Record<string, string | number>) => any
): Promise<Quest[]> => {
    
    const taskHistorySummary = tasks.length > 0 
        ? tasks.slice(0, 50).map(t => `- Task: "${t.text}", Completed: ${t.completed}, Priority: ${t.priority}, Due: ${t.dueDate || 'N/A'}`).join('\n')
        : 'No tasks in history yet.';
    
    const prompt = t('quests.ai_prompt', {
        taskHistory: taskHistorySummary,
        language: language,
    });

    try {
        const response = await generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questSchema,
            },
        });

        const result = JSON.parse(response.text);

        if (result && Array.isArray(result.quests)) {
            return result.quests.map((q: any) => ({
                id: crypto.randomUUID(),
                description: q.description,
                details: q.details,
                type: q.type,
                target: q.target,
                rewardXp: q.rewardXp,
                current: 0,
                claimed: false,
            }));
        }
    } catch (e) {
        console.error("AI Quest Generation Failed:", e);
    }
    
    return []; // Return empty array on failure
};