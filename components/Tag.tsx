import React from 'react';
import { Link } from 'react-router-dom';
import { useSounds } from '../hooks/useSounds.js';
import Icon from './Icon.js';

interface TagProps {
  tagName: string;
}

const Tag: React.FC<TagProps> = ({ tagName }) => {
  const play = useSounds();
  
  return (
    <Link 
      to={`/tags/${encodeURIComponent(tagName)}`}
      onClick={() => play('click')}
      className="flex items-center gap-1 bg-[var(--surface-secondary)] text-xs font-semibold text-[var(--text-muted)] px-2 py-1 rounded-none border border-[var(--border-primary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-accent)] transition-colors"
    >
      <Icon name="tag" className="w-3 h-3"/>
      <span>{tagName}</span>
    </Link>
  );
};

export default Tag;
