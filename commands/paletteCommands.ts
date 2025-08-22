import { registerCommand } from '../lib/commandRegistry.js';

registerCommand({
    id: 'toggle_command_palette',
    // This command does not have a `title` or `section` because it's not meant
    // to be displayed inside the palette itself. It's only triggered by its hotkey.
    title: 'Toggle Command Palette',
    description: 'Open or close the command palette',
    icon: 'terminal',
    hotkey: 'mod+k', // "mod" will be interpreted as Ctrl on Win/Linux and Cmd on Mac
    action: ({ dispatch }) => {
        dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
    }
});
