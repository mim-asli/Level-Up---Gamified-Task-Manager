import { useEffect, useMemo } from 'react';
import { getCommands } from '../lib/commandRegistry.js';
import { useCommandExecutor } from './useCommandExecutor.js';

/**
 * A hook that sets up global event listeners for all registered
 * commands that have a `hotkey` defined.
 */
export const useGlobalHotkeys = () => {
    const { execute } = useCommandExecutor();
    
    // Memoize the list of commands with hotkeys to avoid re-calculating on every render.
    const hotkeyCommands = useMemo(() => getCommands().filter(c => c.hotkey), []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Use 'mod' as a cross-platform modifier for Ctrl/Cmd.
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modKey = isMac ? event.metaKey : event.ctrlKey;

            for (const command of hotkeyCommands) {
                if (!command.hotkey) continue;

                // Simple 'mod+key' format parsing. Can be extended for more complex combos.
                const [mod, key] = command.hotkey.toLowerCase().split('+');
                
                if (mod === 'mod' && modKey && event.key.toLowerCase() === key) {
                    event.preventDefault();
                    execute(command);
                    return; // Stop after finding and executing the first match
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [hotkeyCommands, execute]);
};
