import { AppState, Action, Skill } from '../../types.js';

export function handleSkillAction(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'ADD_SKILL': {
            const skillName = action.payload.name.trim();
            if (skillName && !state.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
                const newSkill: Skill = {
                    name: skillName,
                    xp: 0,
                };
                return { ...state, skills: [...state.skills, newSkill] };
            }
            return state;
        }
        default:
            return state;
    }
}
