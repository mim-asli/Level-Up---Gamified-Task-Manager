import React from 'react';
import Icon, { IconName } from '../components/Icon.js';
import { useAppContext } from '../hooks/useAppContext.js';
import GuideCard from '../components/guide/GuideCard.js';

const guideData: { icon: IconName; titleKey: string; descriptionKey: string; exampleKey: string; linkTo: string; buttonTextKey: string; }[] = [
    {
        icon: 'tasks',
        titleKey: 'guide.dashboard_title',
        descriptionKey: 'guide.dashboard_desc',
        exampleKey: 'guide.dashboard_example',
        linkTo: '/',
        buttonTextKey: 'guide.dashboard_cta',
    },
    {
        icon: 'goal',
        titleKey: 'guide.goals_title',
        descriptionKey: 'guide.goals_desc',
        exampleKey: 'guide.goals_example',
        linkTo: '/goals',
        buttonTextKey: 'guide.goals_cta',
    },
    {
        icon: 'calendar',
        titleKey: 'guide.calendar_title',
        descriptionKey: 'guide.calendar_desc',
        exampleKey: 'guide.calendar_example',
        linkTo: '/calendar',
        buttonTextKey: 'guide.calendar_cta',
    },
    {
        icon: 'journal',
        titleKey: 'guide.journal_title',
        descriptionKey: 'guide.journal_desc',
        exampleKey: 'guide.journal_example',
        linkTo: '/journal',
        buttonTextKey: 'guide.journal_cta',
    },
     {
        icon: 'sparkle',
        titleKey: 'guide.coach_title',
        descriptionKey: 'guide.coach_desc',
        exampleKey: 'guide.coach_example',
        linkTo: '/coach',
        buttonTextKey: 'guide.coach_cta',
    },
    {
        icon: 'gift',
        titleKey: 'guide.rewards_title',
        descriptionKey: 'guide.rewards_desc',
        exampleKey: 'guide.rewards_example',
        linkTo: '/rewards',
        buttonTextKey: 'guide.rewards_cta',
    },
    {
        icon: 'git-branch',
        titleKey: 'guide.skills_title',
        descriptionKey: 'guide.skills_desc',
        exampleKey: 'guide.skills_example',
        linkTo: '/skills',
        buttonTextKey: 'guide.skills_cta',
    },
    {
        icon: 'shield',
        titleKey: 'guide.squads_title',
        descriptionKey: 'guide.squads_desc',
        exampleKey: 'guide.squads_example',
        linkTo: '/squads',
        buttonTextKey: 'guide.squads_cta',
    },
    {
        icon: 'package',
        titleKey: 'guide.armory_title',
        descriptionKey: 'guide.armory_desc',
        exampleKey: 'guide.armory_example',
        linkTo: '/armory',
        buttonTextKey: 'guide.armory_cta',
    },
    {
        icon: 'tag',
        titleKey: 'guide.tags_title',
        descriptionKey: 'guide.tags_desc',
        exampleKey: 'guide.tags_example',
        linkTo: '/tags',
        buttonTextKey: 'guide.tags_cta',
    },
    {
        icon: 'trophy',
        titleKey: 'guide.achievements_title',
        descriptionKey: 'guide.achievements_desc',
        exampleKey: 'guide.achievements_example',
        linkTo: '/achievements',
        buttonTextKey: 'guide.achievements_cta',
    },
    {
        icon: 'users',
        titleKey: 'guide.leaderboard_title',
        descriptionKey: 'guide.leaderboard_desc',
        exampleKey: 'guide.leaderboard_example',
        linkTo: '/leaderboard',
        buttonTextKey: 'guide.leaderboard_cta',
    },
     {
        icon: 'bar-chart-2',
        titleKey: 'guide.progress_title',
        descriptionKey: 'guide.progress_desc',
        exampleKey: 'guide.progress_example',
        linkTo: '/progress',
        buttonTextKey: 'guide.progress_cta',
    },
    {
        icon: 'settings',
        titleKey: 'guide.settings_title',
        descriptionKey: 'guide.settings_desc',
        exampleKey: 'guide.settings_example',
        linkTo: '/settings',
        buttonTextKey: 'guide.settings_cta',
    }
];

const GuidePage: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="space-y-8">
            <div className="text-center group">
                <Icon name="help" className="w-12 h-12 text-[var(--text-primary)] mx-auto mb-4 icon-animated" />
                <h1 className="text-4xl font-bold text-[var(--text-secondary)]">{t('guide.title')}</h1>
                <p className="text-lg text-[var(--text-muted)] mt-2 max-w-2xl mx-auto">{t('guide.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {guideData.map(card => <GuideCard key={card.titleKey} {...card} />)}
            </div>
        </div>
    );
};

export default GuidePage;