import React from 'react';
import { useGlobalHotkeys } from '../hooks/useGlobalHotkeys.js';

/**
 * A non-rendering component whose sole purpose is to activate
 * the global hotkey listener hook.
 */
const GlobalCommandHotkeys: React.FC = () => {
    useGlobalHotkeys();
    return null; 
};

export default GlobalCommandHotkeys;
