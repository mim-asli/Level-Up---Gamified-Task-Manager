import React from 'react';
import Icon, { IconName } from '../Icon.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import { useModalKeyControls } from '../../hooks/useModalKeyControls.js';

interface IconPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (icon: IconName) => void;
}

const ALL_ICONS: IconName[] = [
    'gift', 'coffee', 'film', 'gamepad', 'rocket', 'check', 'plus', 'journal', 'tasks', 'xp', 'calendar', 'sparkle', 'error', 'trophy', 'fire', 'goal', 'link', 'help', 'timer', 'settings', 'bar-chart-2', 'quote', 'crosshair', 'level-up', 'users', 'terminal', 'shield', 'copy'
];

const IconPicker: React.FC<IconPickerProps> = ({ isOpen, onClose, onSelect }) => {
    const { t } = useAppContext();
    const play = useSounds();
    
    useModalKeyControls(isOpen, onClose);

    if (!isOpen) return null;

    const handleSelect = (icon: IconName) => {
        play('click');
        onSelect(icon);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-[var(--surface-primary)] rounded-none w-full max-w-lg p-6 border border-[var(--border-accent)] shadow-[0_0_20px_var(--shadow-accent)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)]">{t('rewards.icon_picker_title')}</h2>
                     <button onClick={onClose} className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] text-2xl leading-none transition-transform hover:rotate-90">&times;</button>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                    {ALL_ICONS.map(iconName => (
                        <button
                            key={iconName}
                            onClick={() => handleSelect(iconName)}
                            className="aspect-square flex items-center justify-center bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border-secondary)] hover:border-[var(--border-accent)] rounded-none transition-colors"
                            title={iconName}
                        >
                            <Icon name={iconName} className="w-7 h-7 text-[var(--text-primary)]" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IconPicker;