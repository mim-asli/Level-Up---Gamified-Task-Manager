import React from 'react';
import Icon from '../components/Icon.js';
import { useAppContext } from '../hooks/useAppContext.js';
import { Theme, Language } from '../types.js';
import { useSounds } from '../hooks/useSounds.js';
import ApiKeyManager from '../components/settings/ApiKeyManager.js';
import ProfileSettings from '../components/settings/ProfileSettings.js';
import LocalAISettings from '../components/settings/LocalAISettings.js';
import SecuritySettings from '../components/settings/SecuritySettings.js';

const SettingsPage: React.FC = () => {
  const { state, dispatch, t, setLanguage } = useAppContext();
  const play = useSounds();

  const handleThemeChange = (theme: Theme) => {
    play('click');
    dispatch({ type: 'SET_THEME', payload: { theme } });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    play('click');
    setLanguage(e.target.value as Language);
  };

  const themes: {key: Theme, name: string}[] = [
      { key: 'hacker', name: t('hacker') },
      { key: 'stealth', name: t('stealth') },
      { key: 'zen', name: t('zen') },
      { key: 'fantasy', name: t('fantasy') },
  ];

  const languages: {key: Language, name: string}[] = [
      { key: 'en', name: t('english') },
      { key: 'fa', name: t('persian') },
  ];

  const handleToggleSound = () => {
    play(state.soundEnabled ? 'toggleOff' : 'toggleOn');
    dispatch({ type: 'TOGGLE_SOUND' });
  };

  return (
    <>
      <div className="space-y-8">
        <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
          <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-3 group">
            <Icon name="settings" className="w-8 h-8 icon-animated" />
            {t('settings.title')}
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl">
            {t('settings.description')}
          </p>
        </div>

        <div className="space-y-6">
          <ProfileSettings />
        
          <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
            <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">{t('settings.language_title')}</h2>
            <select
              value={state.language}
              onChange={handleLanguageChange}
              className="w-full max-w-xs bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
            >
              {languages.map(lang => (
                  <option key={lang.key} value={lang.key}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
            <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">{t('settings.theme_title')}</h2>
            <div className="flex p-1 rounded-none border border-[var(--theme-mode-border)] bg-[var(--theme-mode-bg)]">
              {themes.map(theme => (
                  <button 
                      key={theme.key}
                      className={`px-4 py-1.5 rounded-none text-sm transition-colors ${state.theme === theme.key ? 'bg-[var(--theme-mode-bg-active)] text-[var(--theme-mode-text-active)] shadow-sm' : 'text-[var(--theme-mode-text)] hover:text-[var(--theme-mode-text-active)]'}`}
                      onClick={() => handleThemeChange(theme.key)}
                  >
                      {theme.name}
                  </button>
              ))}
            </div>
          </div>

          <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
            <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">{t('settings.sound_title')}</h2>
            <div className="flex items-center gap-4">
               <Icon name={state.soundEnabled ? 'volume-2' : 'volume-x'} className="w-6 h-6 text-[var(--text-muted)]" />
               <input
                    type="checkbox"
                    checked={state.soundEnabled}
                    onChange={handleToggleSound}
                    className="sr-only peer"
                    id="sound-toggle"
                />
                <label
                    htmlFor="sound-toggle"
                    className="relative w-11 h-6 bg-[var(--interactive-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)] cursor-pointer"
                    aria-label={t('settings.sound_toggle_label')}
                ></label>
                <span className="text-[var(--text-muted)]">{state.soundEnabled ? t('settings.sound_enabled') : t('settings.sound_disabled')}</span>
            </div>
          </div>
          
          <ApiKeyManager />

          <LocalAISettings />

          <SecuritySettings />
          
        </div>
      </div>
    </>
  );
};

export default SettingsPage;