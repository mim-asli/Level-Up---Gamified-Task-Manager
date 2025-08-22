import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import { useSounds } from '../hooks/useSounds.js';
import JournalEntryItem from '../components/JournalEntryItem.js';
import TagInput from '../components/TagInput.js';

const Journal: React.FC = () => {
  const { state, dispatch, t } = useAppContext();
  const [entry, setEntry] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const play = useSounds();

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    state.tasks.forEach(task => task.tags?.forEach(tag => tagSet.add(tag)));
    state.goals.forEach(goal => goal.tags?.forEach(tag => tagSet.add(tag)));
    state.journalEntries.forEach(entry => entry.tags?.forEach(tag => tagSet.add(tag)));
    state.skills.forEach(skill => tagSet.add(skill.name));
    return Array.from(tagSet).sort();
  }, [state.tasks, state.goals, state.journalEntries, state.skills]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry.trim()) {
      play('add');
      dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: { text: entry, tags } });
      setEntry('');
      setTags([]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
        <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-3 group">
          <Icon name="journal" className="w-8 h-8 icon-animated" />
          {t('journal.title')}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder={t('journal.placeholder')}
            className="w-full h-40 p-4 bg-[var(--surface-tertiary)] rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] transition border border-[var(--border-secondary)] focus:border-[var(--border-accent)]"
          />
          <TagInput
            tags={tags}
            setTags={setTags}
            allTags={allTags}
            placeholder={t('tags.add_to_entry_skill')}
          />
          <button
            type="submit"
            disabled={!entry.trim()}
            className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:text-[var(--text-faded)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold py-3 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)] text-lg"
          >
            {t('journal.save_log')}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-secondary)]">{t('journal.past_logs')}</h2>
        {state.journalEntries.length > 0 ? (
          <div className="space-y-4">
            {state.journalEntries.map((item) => (
              <JournalEntryItem key={item.id} entry={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-[var(--surface-primary)] rounded-none border border-[var(--border-primary)]">
            <p className="text-[var(--text-muted)]">{t('journal.empty_log')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;