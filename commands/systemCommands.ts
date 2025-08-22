import { registerCommand } from '../lib/commandRegistry.js';
import { Theme } from '../types.js';

registerCommand({
    id: 'toggle_sound',
    title: 'commands.toggle_sound.title',
    description: 'commands.toggle_sound.desc',
    // The icon is determined dynamically in the CommandPalette component based on state
    icon: 'volume-2', 
    section: 'commands.section.system',
    action: ({ dispatch }) => {
        dispatch({ type: 'TOGGLE_SOUND' });
    }
});

registerCommand({
    id: 'change_theme',
    title: 'commands.change_theme.title',
    description: 'commands.change_theme.desc',
    icon: 'sparkle',
    section: 'commands.section.system',
    action: ({ dispatch, state }) => {
        const themes: Theme[] = ['hacker', 'stealth', 'zen', 'fantasy'];
        const currentThemeIndex = themes.indexOf(state.theme);
        const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
        dispatch({ type: 'SET_THEME', payload: { theme: themes[nextThemeIndex] } });
    }
});
