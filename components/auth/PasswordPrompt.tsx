import React, { useState } from 'react';
import Icon from '../Icon.js';
import { t_standalone as t } from '../../i18n/index.js';

interface PasswordPromptProps {
    mode: 'create' | 'unlock';
    onSubmit: (password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ mode, onSubmit, isLoading, error }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !password.trim()) return;
        if (mode === 'create' && (password !== confirmPassword || !confirmPassword.trim())) return;
        
        onSubmit(password);
    };

    const title = mode === 'create' ? t('auth.create_password_title') : t('auth.unlock_data_title');
    const description = mode === 'create' ? t('auth.create_password_desc') : t('auth.unlock_data_desc');
    const placeholder = mode === 'create' ? t('auth.create_password_placeholder') : t('auth.unlock_data_placeholder');
    const buttonText = mode === 'create' ? t('auth.create_password_button') : t('auth.unlock_data_button');
    
    const passwordsMismatch = mode === 'create' && password.trim() !== '' && confirmPassword.trim() !== '' && password !== confirmPassword;

    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[var(--surface-primary)] p-6 sm:p-8 border border-[var(--border-accent)] shadow-[0_0_20px_var(--shadow-accent)]">
                <div className="text-center mb-6">
                    <Icon name="terminal" className="w-12 h-12 text-[var(--text-primary)] mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[var(--text-secondary)] font-mono">{title}</h1>
                    <p className="text-[var(--text-muted)] mt-2 text-sm">{description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                         <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-[var(--surface-tertiary)] p-3 ps-4 pe-12 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)] font-mono"
                            disabled={isLoading}
                            autoFocus
                        />
                         <span className="absolute end-12 top-1/2 -translate-y-1/2 h-5 w-2 bg-[var(--text-primary)] blinking-cursor"></span>
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1"
                            aria-label={t('auth.toggle_password_visibility')}
                            title={t('auth.toggle_password_visibility')}
                         >
                            <Icon name={showPassword ? 'eye-off' : 'eye'} className="w-5 h-5"/>
                         </button>
                    </div>
                    
                    {mode === 'create' && (
                         <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t('auth.confirm_password_placeholder')}
                                className="w-full bg-[var(--surface-tertiary)] p-3 ps-4 pe-12 rounded-none text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none focus:ring-1 focus:ring-[var(--border-accent)] border border-[var(--border-secondary)] font-mono"
                                disabled={isLoading}
                            />
                        </div>
                    )}
                    
                    {passwordsMismatch && (
                        <p className="text-sm text-center text-[var(--text-danger)]">{t('auth.password_mismatch_error')}</p>
                    )}
                    {error && (
                        <p className="text-sm text-center text-[var(--text-danger)] animate-flash">{error}</p>
                    )}
                    
                    <button
                        type="submit"
                        className="w-full group flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-wait text-[var(--accent-primary-text)] font-bold py-3 px-4 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                        disabled={!password.trim() || isLoading || (mode === 'create' && (!confirmPassword.trim() || password !== confirmPassword))}
                    >
                       {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                                <span>{t('auth.unlocking')}</span>
                            </>
                       ) : (
                            buttonText
                       )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordPrompt;