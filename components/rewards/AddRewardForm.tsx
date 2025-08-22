import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import Icon, { IconName } from '../Icon.js';
import IconPicker from './IconPicker.js';

interface AddRewardFormProps {
    onFormSubmit: () => void;
}

const AddRewardForm: React.FC<AddRewardFormProps> = ({ onFormSubmit }) => {
    const { t, dispatch } = useAppContext();
    const play = useSounds();

    const [name, setName] = useState('');
    const [cost, setCost] = useState<number | ''>('');
    const [icon, setIcon] = useState<IconName>('gift');
    const [isOneTime, setIsOneTime] = useState(false);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && cost !== '' && cost > 0) {
            play('add');
            dispatch({ type: 'ADD_REWARD', payload: { name, cost, icon, isOneTime } });
            setName('');
            setCost('');
            setIcon('gift');
            setIsOneTime(false);
            onFormSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-secondary)]">{t('rewards.add_new_reward')}</h3>
            <div>
                <label htmlFor="reward-name" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('rewards.name_label')}</label>
                <input
                    id="reward-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('rewards.name_placeholder')}
                    className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                    required
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="reward-cost" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('rewards.cost_label')}</label>
                    <input
                        id="reward-cost"
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        placeholder="100"
                        className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                        required
                        min="1"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('rewards.icon_label')}</label>
                    <button type="button" onClick={() => setIsIconPickerOpen(true)} className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)] flex items-center gap-2">
                        <Icon name={icon} className="w-5 h-5" />
                        <span>{icon}</span>
                    </button>
                 </div>
            </div>
            <div className="flex items-center gap-3">
                 <input
                    type="checkbox"
                    id="one-time-reward"
                    checked={isOneTime}
                    onChange={(e) => setIsOneTime(e.target.checked)}
                    className="h-4 w-4 rounded-none bg-[var(--surface-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer"
                />
                 <label htmlFor="one-time-reward" className="text-sm text-[var(--text-muted)] cursor-pointer">{t('rewards.one_time_label')}</label>
            </div>
            <button
                type="submit"
                disabled={!name.trim() || cost === '' || cost <= 0}
                className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold py-2 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
            >
                {t('rewards.add_reward_button')}
            </button>

            <IconPicker 
                isOpen={isIconPickerOpen}
                onClose={() => setIsIconPickerOpen(false)}
                onSelect={(selectedIcon) => {
                    setIcon(selectedIcon);
                    setIsIconPickerOpen(false);
                }}
            />
        </form>
    );
};

export default AddRewardForm;