import React, { useState } from 'react';
import Icon from '../Icon.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import ConfirmationModal from '../ConfirmationModal.js';
import { useSounds } from '../../hooks/useSounds.js';

const ApiKeyManager: React.FC = () => {
    const { state, dispatch, t } = useAppContext();
    const play = useSounds();
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyValue, setNewKeyValue] = useState('');
    const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

    const handleAddKey = (e: React.FormEvent) => {
        e.preventDefault();
        if (newKeyName.trim() && newKeyValue.trim()) {
            play('add');
            dispatch({ type: 'ADD_API_KEY', payload: { name: newKeyName, key: newKeyValue } });
            setNewKeyName('');
            setNewKeyValue('');
        }
    };
    
    const handleDelete = (id: string) => {
      play('error');
      setKeyToDelete(id);
    };

    const confirmDelete = () => {
      if (keyToDelete) {
        dispatch({ type: 'DELETE_API_KEY', payload: { id: keyToDelete } });
        setKeyToDelete(null);
      }
    };
    
    const handleToggleStatus = (id: string) => {
        play('toggleOn');
        dispatch({ type: 'TOGGLE_API_KEY_STATUS', payload: { id }});
    }
    
    const maskKey = (key: string) => {
        if (key.length < 12) return '**********';
        return `${key.slice(0, 8)}...${key.slice(-4)}`;
    };

    return (
        <>
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-2">{t('settings.api_keys_title')}</h2>
                <p className="text-[var(--text-muted)] mb-4">{t('settings.api_keys_desc')}</p>
                
                <form onSubmit={handleAddKey} className="p-4 bg-[var(--surface-secondary)] rounded-none border border-[var(--border-primary)] space-y-4 mb-6">
                    <h3 className="font-semibold text-[var(--text-primary)]">{t('settings.api_keys_add_new')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="key-name" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('settings.api_keys_name')}</label>
                            <input
                                id="key-name"
                                type="text"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder={t('settings.api_keys_name_placeholder')}
                                className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="key-value" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('settings.api_keys_value')}</label>
                            <input
                                id="key-value"
                                type="password"
                                value={newKeyValue}
                                onChange={(e) => setNewKeyValue(e.target.value)}
                                placeholder={t('settings.api_keys_value_placeholder')}
                                className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                                required
                            />
                        </div>
                    </div>
                     <button
                        type="submit"
                        className="group w-full flex items-center justify-center gap-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-secondary-text)] font-bold py-2 rounded-none transition-all duration-200 border border-[var(--border-secondary)]"
                        disabled={!newKeyName.trim() || !newKeyValue.trim()}
                    >
                        <Icon name="plus" className="w-5 h-5 icon-animated" />
                        {t('settings.api_keys_add_button')}
                    </button>
                </form>

                <h3 className="font-semibold text-[var(--text-primary)] mb-4">{t('settings.api_keys_pool')}</h3>
                <div className="space-y-3">
                    {state.apiKeys.length === 0 && (
                        <p className="text-center text-[var(--text-muted)] py-4">{t('settings.api_keys_none')}</p>
                    )}
                    {state.apiKeys.map(apiKey => (
                        <div key={apiKey.id} className={`p-3 bg-[var(--surface-secondary)] border ${apiKey.isEnabled ? 'border-[var(--border-accent)]' : 'border-[var(--border-primary)] opacity-70'} flex flex-col sm:flex-row items-center gap-3 justify-between`}>
                            <div className="flex-grow">
                                <p className="font-bold text-[var(--text-secondary)]">{apiKey.name}</p>
                                <p className="text-sm text-[var(--text-muted)] font-mono">{maskKey(apiKey.key)}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                     <input
                                        type="checkbox"
                                        checked={apiKey.isEnabled}
                                        onChange={() => handleToggleStatus(apiKey.id)}
                                        className="sr-only peer"
                                        id={`toggle-key-${apiKey.id}`}
                                    />
                                    <label
                                        htmlFor={`toggle-key-${apiKey.id}`}
                                        className="relative w-11 h-6 bg-[var(--interactive-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)] cursor-pointer"
                                    ></label>
                                    <span className="text-sm font-semibold text-[var(--text-muted)]">{apiKey.isEnabled ? t('settings.api_keys_enabled') : t('settings.api_keys_disabled')}</span>
                                </div>
                                <button onClick={() => handleDelete(apiKey.id)} className="p-2 bg-[var(--accent-danger)] hover:bg-[var(--accent-danger-hover)] text-[var(--accent-danger-text)] transition-colors" aria-label={t('settings.api_keys_delete')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmationModal
                isOpen={!!keyToDelete}
                onClose={() => setKeyToDelete(null)}
                onConfirm={confirmDelete}
                title={t('settings.api_keys_delete_confirm_title')}
                message={t('settings.api_keys_delete_confirm_msg')}
            />
        </>
    )
}

export default ApiKeyManager;