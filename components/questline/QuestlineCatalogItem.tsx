import React from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import Icon, { IconName } from '../Icon.js';

export interface PredefinedQuestline {
    id: string;
    nameKey: string;
    descriptionKey: string;
    icon: IconName;
    deadlineMonths: number;
    steps: { textKey: string; xp: number; }[];
}

interface QuestlineCatalogItemProps {
    questline: PredefinedQuestline;
    onAdd: () => void;
    isAdded: boolean;
}

const QuestlineCatalogItem: React.FC<QuestlineCatalogItemProps> = ({ questline, onAdd, isAdded }) => {
    const { t } = useAppContext();

    return (
        <div className="group bg-[var(--surface-secondary)] p-6 rounded-none border border-[var(--border-primary)] flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-accent)] hover:shadow-[0_0_20px_var(--shadow-accent)]">
            <div className="flex items-center gap-3">
                <Icon name={questline.icon} className="w-10 h-10 text-[var(--text-primary)] icon-animated" />
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-secondary)]">{t(questline.nameKey)}</h3>
                    <p className="text-[var(--text-muted)]">{t(questline.descriptionKey)}</p>
                </div>
            </div>
            
            <div className="border-t border-[var(--border-primary)] pt-4">
                 <h4 className="font-semibold text-[var(--text-muted)] mb-2">{t('goals.questline_steps')}</h4>
                 <ul className="space-y-2">
                    {questline.steps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                            <Icon name="chevron-right" className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                            <span className="text-[var(--text-primary)]">{t(step.textKey)}</span>
                            <span className="ms-auto ps-2 font-mono text-xs text-[var(--text-primary)] opacity-70">+{step.xp} XP</span>
                        </li>
                    ))}
                 </ul>
            </div>

            <div className="mt-auto pt-4">
                <button
                    onClick={onAdd}
                    disabled={isAdded}
                    className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold py-3 px-5 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)] text-lg"
                >
                    {isAdded ? t('goals.questline_active') : t('goals.begin_questline')}
                </button>
            </div>
        </div>
    );
};

export default QuestlineCatalogItem;