import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './useAppContext.js';
import { Command } from '../types.js';

/**
 * Provides a function to execute any registered command.
 * This hook abstracts away the need to manually pass context like
 * dispatch and navigate into a command's action.
 * @returns An object containing the `execute` function.
 */
export const useCommandExecutor = () => {
    const { dispatch, state, t } = useAppContext();
    const navigate = useNavigate();

    const execute = useCallback((command: Command | undefined) => {
        if (!command) return;
        // The action receives the full context it might need to perform its duty.
        command.action({ dispatch, navigate, state, t });
    }, [dispatch, navigate, state, t]);

    return { execute };
};
