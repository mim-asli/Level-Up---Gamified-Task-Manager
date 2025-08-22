import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import { usePrevious } from '../hooks/usePrevious.js';
import { calculatePlayerLevelState } from '../lib/utils.js';
import LevelUpModal from './LevelUpModal.js';
import { useSounds } from '../hooks/useSounds.js';

const LevelUpNotifier: React.FC = () => {
    const { state } = useAppContext();
    const play = useSounds();

    const { currentLevel } = calculatePlayerLevelState(state.tasks);
    const previousLevel = usePrevious(currentLevel);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [levelToShow, setLevelToShow] = useState(0);

    useEffect(() => {
        // Only trigger if previousLevel is not undefined (to avoid triggering on first load)
        // and the new level is actually higher.
        if (previousLevel !== undefined && currentLevel > previousLevel) {
            setLevelToShow(currentLevel);
            setIsModalOpen(true);
        }
    }, [currentLevel, previousLevel]);

    const handleClose = () => {
        play('click');
        setIsModalOpen(false);
    };

    return (
        <LevelUpModal 
            isOpen={isModalOpen}
            onClose={handleClose} 
            newLevel={levelToShow} 
        />
    );
};

export default LevelUpNotifier;