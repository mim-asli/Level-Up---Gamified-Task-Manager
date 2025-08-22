import { useEffect } from 'react';

/**
 * A hook to add an Escape key listener to close modals or other components.
 * @param isOpen - Boolean indicating if the component is active.
 * @param onClose - The function to call when Escape is pressed.
 */
export const useModalKeyControls = (isOpen: boolean, onClose: () => void) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
};
