import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon, { IconName } from '../Icon.js';
import { useAppContext } from '../../hooks/useAppContext.js';

interface GuideCardProps {
    icon: IconName;
    titleKey: string;
    descriptionKey: string;
    exampleKey: string;
    linkTo: string;
    buttonTextKey: string;
}

const GuideCard: React.FC<GuideCardProps> = ({ icon, titleKey, descriptionKey, exampleKey, linkTo, buttonTextKey }) => {
    const { t } = useAppContext();
    return (
        <div className="group bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-accent)] hover:shadow-[0_0_20px_var(--shadow-accent)]">
            <div className="flex items-center gap-3 mb-4">
                <Icon name={icon} className="w-8 h-8 text-[var(--text-primary)] icon-animated" />
                <h2 className="text-2xl font-bold text-[var(--text-secondary)]">{t(titleKey)}</h2>
            </div>
            <div className="flex-grow space-y-4 text-[var(--text-primary)]">
                <p>{t(descriptionKey)}</p>
                <p className="border-s-2 border-[var(--border-secondary)] ps-3 italic text-[var(--text-muted)]">{t(exampleKey)}</p>
            </div>
            <div className="mt-6">
                <Link to={linkTo} className="block w-full text-center bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-3 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]">
                    {t(buttonTextKey)}
                </Link>
            </div>
        </div>
    );
};

export default memo(GuideCard);