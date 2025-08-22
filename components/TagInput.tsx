import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    allTags: string[];
    placeholder: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, allTags, placeholder }) => {
    const { t } = useAppContext();
    const play = useSounds();
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputValue.trim()) {
            const lowercasedInput = inputValue.toLowerCase();
            const filtered = allTags.filter(tag => 
                tag.toLowerCase().includes(lowercasedInput) && 
                !tags.includes(tag)
            );
            setSuggestions(filtered.slice(0, 5)); // Limit suggestions
        } else {
            setSuggestions([]);
        }
    }, [inputValue, allTags, tags]);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            play('add');
            setTags([...tags, trimmedTag]);
        }
        setInputValue('');
        setSuggestions([]);
    };
    
    const removeTag = (tagToRemove: string) => {
        play('click');
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue) {
            removeTag(tags[tags.length - 1]);
        }
    };
    
    return (
        <div className="relative">
            <div className="flex flex-wrap items-center gap-2 p-2 bg-[var(--surface-tertiary)] rounded-none border border-[var(--border-secondary)] focus-within:border-[var(--border-accent)] focus-within:shadow-[0_0_10px_var(--shadow-accent)] transition-all">
                {tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 bg-[var(--surface-secondary)] text-xs font-semibold text-[var(--text-muted)] ps-2 pe-1 py-1 rounded-none border border-[var(--border-primary)]">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(tag)} className="text-[var(--text-faded)] hover:text-[var(--text-danger)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-grow bg-transparent p-1 text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none"
                />
            </div>
            {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[var(--surface-raised)] border border-[var(--border-secondary)] shadow-lg">
                    {suggestions.map(suggestion => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => addTag(suggestion)}
                            className="w-full text-start px-3 py-2 text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagInput;
