import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import TaskList from '../components/TaskList.js';
import GoalItem from '../components/GoalItem.js';
import JournalEntryItem from '../components/JournalEntryItem.js';

const TagDetailPage: React.FC = () => {
    const { tagName } = useParams<{ tagName: string }>();
    const { state, t, language } = useAppContext();

    const decodedTagName = useMemo(() => {
        try {
            return tagName ? decodeURIComponent(tagName) : '';
        } catch (e) {
            return tagName || '';
        }
    }, [tagName]);

    const filteredItems = useMemo(() => {
        if (!decodedTagName) return { tasks: [], goals: [], journalEntries: [] };

        const tasks = state.tasks.filter(t => t.tags?.includes(decodedTagName));
        const goals = state.goals.filter(g => g.tags?.includes(decodedTagName));
        const journalEntries = state.journalEntries.filter(j => j.tags?.includes(decodedTagName));

        return { tasks, goals, journalEntries };
    }, [decodedTagName, state.tasks, state.goals, state.journalEntries]);

    return (
        <div className="space-y-8">
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                 <Link to="/tags" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 mb-2">
                    <Icon name={language === 'fa' ? 'chevron-right' : 'chevron-left'} className="w-4 h-4" />
                    {t('tags.title')}
                 </Link>
                <h1 className="text-3xl font-bold text-[var(--text-secondary)] flex items-center gap-3">
                    <Icon name="tag" className="w-8 h-8 text-[var(--text-primary)]" />
                    <span>{t('tags.items_tagged_with', { tag: decodedTagName })}</span>
                </h1>
            </div>

            {filteredItems.goals.length === 0 && filteredItems.tasks.length === 0 && filteredItems.journalEntries.length === 0 && (
                 <div className="text-center py-10 px-4 bg-[var(--surface-primary)] rounded-none border border-[var(--border-primary)]">
                    <p className="text-[var(--text-muted)]">{t('tags.no_items_found')}</p>
                 </div>
            )}

            {filteredItems.tasks.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)]">{t('tags.tasks')}</h2>
                    <TaskList tasks={filteredItems.tasks} title="" />
                </div>
            )}

            {filteredItems.goals.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)]">{t('tags.goals')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.goals.map((goal, index) => (
                            <GoalItem key={goal.id} goal={goal} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {filteredItems.journalEntries.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)]">{t('tags.journal_entries')}</h2>
                    <div className="space-y-4">
                        {filteredItems.journalEntries.map(entry => (
                            <JournalEntryItem key={entry.id} entry={entry} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagDetailPage;