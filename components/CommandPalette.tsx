import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon, { IconName } from './Icon.js';
import { useSounds } from '../hooks/useSounds.js';
import { getCommands, getCommandById } from '../lib/commandRegistry.js';
import { useCommandExecutor } from '../hooks/useCommandExecutor.js';
import { Command } from '../types.js';


const CommandPalette: React.FC = () => {
    const { state, dispatch, t } = useAppContext();
    const play = useSounds();
    const { execute } = useCommandExecutor();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const dialogRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const closePalette = () => dispatch({ type: 'CLOSE_COMMAND_PALETTE' });

    const visibleCommands = useMemo(() => {
        // Get commands that are meant to be visible in the palette and translate them
        return getCommands()
            .filter(c => c.section)
            .map(cmd => {
                const getDynamicIcon = (command: Command): IconName => {
                    if (command.id === 'toggle_sound') {
                        return state.soundEnabled ? 'volume-2' : 'volume-x';
                    }
                    return command.icon;
                };

                return {
                    ...cmd,
                    title: t(cmd.title),
                    description: t(cmd.description),
                    section: t(cmd.section!),
                    icon: getDynamicIcon(cmd),
                };
            });
    }, [t, state.soundEnabled, state.language]);


    const filteredCommands = useMemo(() => {
        if (!searchTerm) return visibleCommands;
        return visibleCommands.filter(cmd =>
            cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, visibleCommands]);
    
    useEffect(() => {
        if(state.isCommandPaletteOpen) {
            setSearchTerm('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [state.isCommandPaletteOpen]);

    useEffect(() => {
        setActiveIndex(0);
    }, [searchTerm]);

    useEffect(() => {
        if (!listRef.current) return;
        const activeItem = listRef.current.querySelector(`#command-item-${activeIndex}`);
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);
    
    const handleExecuteCommand = (command: Command) => {
        play('click');
        const originalCommand = getCommandById(command.id);
        if (originalCommand) {
            execute(originalCommand);
        }
        closePalette();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!state.isCommandPaletteOpen) return;
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if(filteredCommands[activeIndex]) {
                    handleExecuteCommand(filteredCommands[activeIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closePalette();
            } else if (e.key === 'Tab') {
                // Basic focus trap
                const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>('input, [role="option"]');
                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.isCommandPaletteOpen, activeIndex, filteredCommands, play, closePalette]);

    if (!state.isCommandPaletteOpen) return null;
    
    const activeCommandId = filteredCommands[activeIndex] ? `command-item-${activeIndex}` : undefined;
    
    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        (acc[cmd.section] = acc[cmd.section] || []).push(cmd);
        return acc;
    }, {} as Record<string, Command[]>);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-start z-50 p-4 pt-[15vh] animate-subtle-fade-in" onClick={closePalette}>
            <div
                ref={dialogRef}
                className="bg-[var(--surface-primary)] rounded-none w-full max-w-xl border border-[var(--border-accent)] shadow-[0_0_30px_var(--shadow-accent)]"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="palette-title"
            >
                <h2 id="palette-title" className="sr-only">{t('command_palette.title')}</h2>
                <div className="relative flex items-center border-b border-[var(--border-secondary)]">
                    <Icon name="search" className="w-5 h-5 absolute start-4 text-[var(--text-muted)] pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t('command_palette.placeholder')}
                        className="w-full bg-transparent ps-12 p-4 text-lg text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="command-list"
                        aria-activedescendant={activeCommandId}
                    />
                </div>
                <div ref={listRef} id="command-list" role="listbox" className="max-h-96 overflow-y-auto">
                    {filteredCommands.length > 0 ? (
                        Object.entries(groupedCommands).map(([section, commands]) => (
                            <div key={section} className="p-2">
                                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase px-2 mb-1">{section}</h4>
                                {commands.map(cmd => {
                                    const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                                    const isActive = activeIndex === globalIndex;
                                    return (
                                        <div
                                            key={cmd.id}
                                            id={`command-item-${globalIndex}`}
                                            role="option"
                                            aria-selected={isActive}
                                            onClick={() => handleExecuteCommand(cmd)}
                                            onMouseEnter={() => setActiveIndex(globalIndex)}
                                            className={`flex items-center gap-4 p-2 rounded-none cursor-pointer ${isActive ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)]' : 'hover:bg-[var(--surface-secondary)]'}`}
                                            tabIndex={-1}
                                        >
                                            <Icon name={cmd.icon} className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-inherit' : 'text-[var(--text-primary)]'}`} />
                                            <div>
                                                <p className={`font-semibold ${isActive ? 'text-inherit' : 'text-[var(--text-secondary)]'}`}>{cmd.title}</p>
                                                <p className={`text-sm ${isActive ? 'text-inherit opacity-80' : 'text-[var(--text-muted)]'}`}>{cmd.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-center text-[var(--text-muted)]">{t('command_palette.no_results')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;