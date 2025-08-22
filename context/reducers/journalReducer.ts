import { AppState, Action, JournalEntry } from '../../types.js';

export function handleJournalAction(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'ADD_JOURNAL_ENTRY': {
            const newEntry: JournalEntry = {
                id: crypto.randomUUID(),
                text: action.payload.text,
                createdAt: new Date().toISOString(),
                tags: action.payload.tags || [],
            };

            const updatedQuests = state.dailyQuests.quests.map(q => {
                if (q.claimed) return q;
                if (q.type === 'WRITE_JOURNAL') {
                    return { ...q, current: q.current + 1 };
                }
                return q;
            });

            return {
                ...state,
                journalEntries: [newEntry, ...state.journalEntries],
                dailyQuests: { ...state.dailyQuests, quests: updatedQuests },
            };
        }
        default:
            return state;
    }
}