import React, { useState, useEffect, useRef, memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon, { IconName } from './Icon.js';
import { useAppContext } from '../hooks/useAppContext.js';
import { useSounds } from '../hooks/useSounds.js';

const Header: React.FC = () => {
  const { dispatch, t } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const play = useSounds();
  
  const primaryLinks: {to: string, icon: IconName, textKey: string}[] = [
    { to: "/", icon: "tasks", textKey: "header.dashboard" },
    { to: "/goals", icon: "goal", textKey: "header.goals" },
    { to: "/calendar", icon: "calendar", textKey: "header.calendar" },
    { to: "/journal", icon: "journal", textKey: "header.journal" },
    { to: "/coach", icon: "sparkle", textKey: "header.coach" },
  ];

  const dropdownLinks: {to: string, icon: IconName, textKey: string}[] = [
    { to: "/rewards", icon: "gift", textKey: "header.rewards" },
    { to: "/skills", icon: "git-branch", textKey: "header.skills" },
    { to: "/squads", icon: "shield", textKey: "header.squads" },
    { to: "/armory", icon: "package", textKey: "header.armory" },
    { to: "/tags", icon: "tag", textKey: "header.tags" },
    { to: "/leaderboard", icon: "users", textKey: "header.leaderboard" },
    { to: "/progress", icon: "bar-chart-2", textKey: "header.progress" },
    { to: "/tasks", icon: "tasks", textKey: "header.archive" },
    { to: "/achievements", icon: "trophy", textKey: "header.achievements" },
    { to: "/guide", icon: "help", textKey: "header.guide" },
    { to: "/settings", icon: "settings", textKey: "header.settings" },
  ];

  const linkStyles = "relative flex items-center gap-2 px-3 sm:px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-secondary)] transition-colors duration-200";
  const activeLinkStyles = "text-[var(--text-secondary)] bg-[var(--surface-secondary)]";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const isDropdownActive = dropdownLinks.some(link => location.pathname === link.to || location.pathname.startsWith('/tags/'));

  const openCommandPalette = () => {
    play('click');
    dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
  };

  return (
    <header className="bg-[var(--surface-primary)] bg-opacity-80 backdrop-blur-sm p-4 sticky top-0 z-20 border-b border-[var(--border-faded)]">
      <nav className="container mx-auto flex justify-between items-center">
        <NavLink to="/" onClick={() => play('click')} className="glitch-effect flex items-center gap-3 text-2xl font-bold text-[var(--text-secondary)] transition-transform hover:scale-105 font-mono group">
          <Icon name="level-up" className="w-8 h-8 icon-animated"/>
          Level Up
        </NavLink>
        <div className="flex items-center gap-1 md:gap-2">
           <button 
              onClick={openCommandPalette}
              className="group relative flex items-center gap-2 px-3 sm:px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-secondary)] transition-colors duration-200"
              title={t('command_palette.tooltip')}
            >
              <Icon name="terminal" className="w-5 h-5 icon-animated" />
          </button>
          {primaryLinks.map(link => (
            <NavLink key={link.to} to={link.to} onClick={() => play('click')} className={({isActive}) => `group ${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
              {({isActive}) => (
                <>
                  <Icon name={link.icon} className="w-5 h-5 icon-animated"/>
                  <span className="hidden sm:inline">{t(link.textKey)}</span>
                  {isActive && <div className="absolute bottom-[-17px] inset-x-0 w-full h-0.5 bg-[var(--border-accent)] animate-grow-underline"></div>}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                play('click');
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className={`group ${linkStyles} ${isDropdownActive ? activeLinkStyles : ''}`}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              aria-label={t('header.more_options')}
            >
              <Icon name="more-vertical" className="w-5 h-5 icon-animated"/>
              <span className="hidden sm:inline">{t('header.more')}</span>
              {isDropdownActive && <div className="absolute bottom-[-17px] inset-x-0 w-full h-0.5 bg-[var(--border-accent)] animate-grow-underline"></div>}
            </button>
            {isDropdownOpen && (
              <>
                <style>{`
                  @keyframes fade-in-down {
                      from { opacity: 0; transform: translateY(-10px); }
                      to { opacity: 1; transform: translateY(0); }
                  }
                  .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }
                `}</style>
                <div className="absolute end-0 mt-2 w-48 bg-[var(--surface-raised)] backdrop-blur-sm border border-[var(--border-secondary)] shadow-2xl py-2 animate-fade-in-down">
                  {dropdownLinks.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => play('click')}
                      className={({isActive}) => `group flex items-center gap-3 w-full px-4 py-2.5 text-sm ${isActive ? 'bg-[var(--surface-tertiary)] text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'} hover:bg-[var(--surface-secondary)] transition-colors`}
                    >
                      <Icon name={link.icon} className="w-5 h-5 icon-animated" />
                      <span>{t(link.textKey)}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default memo(Header);