import React, { useMemo, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import Tag from '../components/Tag.js';
import { Link } from 'react-router-dom';

const TagsListPage: React.FC = () => {
    const { state, t } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const allTagsWithCounts = useMemo(() => {
        const tagCounts: Record<string, number> = {};
        const collectTags = (items: { tags?: string[] }[]) => {
            items.forEach(item => {
                item.tags?.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });
        };

        collectTags(state.tasks);
        collectTags(state.goals);
        collectTags(state.journalEntries);

        return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    }, [state.tasks, state.goals, state.journalEntries]);
    
    const filteredTags = useMemo(() => {
        if (!searchTerm.trim()) {
            return allTagsWithCounts;
        }
        const lowercasedSearch = searchTerm.toLowerCase();
        return allTagsWithCounts.filter(([tag]) => 
            tag.toLowerCase().includes(lowercasedSearch)
        );
    }, [searchTerm, allTagsWithCounts]);

    return (
        <div className="space-y-8">
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-3 group">
                    <Icon name="tag" className="w-8 h-8 icon-animated" />
                    {t('tags.title')}
                </h1>
                <p className="text-[var(--text-muted)] max-w-2xl">{t('tags.description')}</p>
            </div>
            
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                 <div className="relative flex items-center mb-6">
                    <Icon name="search" className="w-5 h-5 absolute start-4 text-[var(--text-muted)] pointer-events-none" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t('tags.search_placeholder')}
                        className="w-full bg-[var(--surface-tertiary)] ps-12 p-3 text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none border border-[var(--border-secondary)] focus:border-[var(--border-accent)]"
                    />
                </div>
                
                {filteredTags.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                        {filteredTags.map(([tag, count]) => (
                            <Link 
                                key={tag} 
                                to={`/tags/${encodeURIComponent(tag)}`}
                                className="group flex items-center gap-2 bg-[var(--surface-secondary)] p-3 rounded-none border border-[var(--border-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-tertiary)] transition-colors"
                            >
                                <Icon name="tag" className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
                                <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors">{tag}</span>
                                <span className="text-sm font-mono bg-[var(--surface-tertiary)] text-[var(--text-muted)] px-2 py-0.5 border border-[var(--border-secondary)] rounded-none group-hover:border-[var(--border-accent)] group-hover:text-[var(--text-secondary)] transition-colors">
                                    {count}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-[var(--text-muted)]">{t('tags.no_tags_found')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagsListPage;