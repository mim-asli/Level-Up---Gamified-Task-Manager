import React, { useState, useEffect } from 'react';
import Icon from '../Icon.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import { LocalAIConfig } from '../../types.js';

const LocalAISettings: React.FC = () => {
    const { state, dispatch, t } = useAppContext();
    const play = useSounds();
    const [config, setConfig] = useState<LocalAIConfig>(state.localAIConfig);

    useEffect(() => {
        setConfig(state.localAIConfig);
    }, [state.localAIConfig]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        play('add');
        dispatch({ type: 'SET_LOCAL_AI_CONFIG', payload: { config } });
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const isDirty = JSON.stringify(config) !== JSON.stringify(state.localAIConfig);

    return (
        <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
            <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-2">{t('settings.local_ai_title')}</h2>
            <p className="text-[var(--text-muted)] mb-4">{t('settings.local_ai_desc')}</p>
            
            <form onSubmit={handleSave} className="space-y-4">
                <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        id="local-ai-enabled"
                        name="enabled"
                        checked={config.enabled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                    />
                    <label
                        htmlFor="local-ai-enabled"
                        className="relative w-11 h-6 bg-[var(--interactive-muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)] cursor-pointer"
                    ></label>
                    <label htmlFor="local-ai-enabled" className="text-sm font-semibold text-[var(--text-primary)] cursor-pointer">{t('settings.local_ai_enable')}</label>
                </div>
                
                <div className={`${!config.enabled && 'opacity-50 pointer-events-none'}`}>
                    <div>
                        <label htmlFor="local-ai-url" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('settings.local_ai_endpoint_url')}</label>
                        <input
                            id="local-ai-url"
                            name="url"
                            type="text"
                            value={config.url}
                            onChange={handleInputChange}
                            placeholder={t('settings.local_ai_endpoint_url_placeholder')}
                            className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                            disabled={!config.enabled}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="local-ai-key" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('settings.local_ai_api_key')}</label>
                            <input
                                id="local-ai-key"
                                name="apiKey"
                                type="password"
                                value={config.apiKey}
                                onChange={handleInputChange}
                                className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                                disabled={!config.enabled}
                            />
                        </div>
                         <div>
                            <label htmlFor="local-ai-model" className="block text-sm font-medium text-[var(--text-muted)] mb-1">{t('settings.local_ai_model_name')}</label>
                            <input
                                id="local-ai-model"
                                name="modelName"
                                type="text"
                                value={config.modelName}
                                onChange={handleInputChange}
                                placeholder={t('settings.local_ai_model_name_placeholder')}
                                className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)]"
                                disabled={!config.enabled}
                            />
                        </div>
                    </div>
                </div>

                 <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold py-2 rounded-none transition-all duration-200 border border-[var(--border-accent)]"
                    disabled={!isDirty}
                >
                    <Icon name="check" className="w-5 h-5 icon-animated" />
                    {t('settings.local_ai_save_button')}
                </button>
            </form>
        </div>
    );
};

export default LocalAISettings;
