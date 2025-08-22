import React, { useState, memo } from 'react';
import { JournalEntry } from '../types.js';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';
import Icon from './Icon.js';
import Tag from './Tag.js';

interface JournalEntryItemProps {
  entry: JournalEntry;
}

const JournalEntryItem: React.FC<JournalEntryItemProps> = ({ entry }) => {
  const { t, language } = useAppContext();
  const play = useSounds();
  const [copied, setCopied] = useState(false);
  const hasTags = entry.tags && entry.tags.length > 0;

  const handleCopy = () => {
    play('click');
    navigator.clipboard.writeText(entry.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      play('error');
    });
  };

  return (
    <div className="bg-[var(--surface-primary)] p-4 rounded-none border border-[var(--border-primary)] group space-y-3">
      <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{entry.text}</p>
      
      {hasTags && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-secondary)]">
          {entry.tags!.map(tag => <Tag key={tag} tagName={tag} />)}
        </div>
      )}

      <div className="flex justify-end items-center gap-2 text-xs text-[var(--text-muted)] mt-2">
        <span>
            {new Date(entry.createdAt).toLocaleString(language, { 
                dateStyle: t('date_formats.date_medium') as 'medium' | 'full' | 'long' | 'short', 
                timeStyle: t('date_formats.time_short') as 'short' | 'medium' | 'long' | 'full' 
            })}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 rounded-none text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          title={t('journal.copy')}
          aria-label={t('journal.copy')}
        >
          {copied ? (
            <div className="flex items-center gap-1 text-[var(--text-primary)]">
              <Icon name="check" className="w-4 h-4" />
              <span>{t('journal.copied')}</span>
            </div>
          ) : (
            <Icon name="copy" className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(JournalEntryItem);