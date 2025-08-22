import { Command } from '../types.js';

// Using a Map to ensure unique command IDs and easy lookup
const commands = new Map<string, Command>();

/**
 * Registers a command, making it available to the application.
 * @param command The command object to register.
 */
export const registerCommand = (command: Command): void => {
    if (commands.has(command.id)) {
        console.warn(`Command with id "${command.id}" is already registered. Overwriting.`);
    }
    commands.set(command.id, command);
};

/**
 * Retrieves all registered commands.
 * @returns An array of all command objects.
 */
export const getCommands = (): Command[] => {
    return Array.from(commands.values());
};

/**
 * Retrieves a single command by its unique ID.
 * @param id The ID of the command to retrieve.
 * @returns The command object, or undefined if not found.
 */
export const getCommandById = (id: string): Command | undefined => {
    return commands.get(id);
};
