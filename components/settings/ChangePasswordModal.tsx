import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import Icon from '../Icon.js';
import { decrypt, encrypt } from '../../lib/crypto.js';
import { useModalKeyControls } from '../../hooks/useModalKeyControls.js';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const VERIFICATION_KEY = 'levelUpVerification';
const ENCRYPTED_STATE_KEY = 'levelUpEncryptedData';

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const { t } = useAppContext();
    const play = useSounds();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);

    const resetState = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setStatus('idle');
        setError(null);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };
    
    useModalKeyControls(isOpen, handleClose);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError(t('password_modal.error_mismatch'));
            play('error');
            return;
        }

        setStatus('loading');
        play('click');
        
        try {
            const verificationData = localStorage.getItem(VERIFICATION_KEY);
            const encryptedState = localStorage.getItem(ENCRYPTED_STATE_KEY);

            if (!verificationData || !encryptedState) {
                throw new Error("Could not find encrypted data to update.");
            }

            // 1. Verify old password
            await decrypt(verificationData, currentPassword);

            // 2. Decrypt old state
            const decryptedState = await decrypt(encryptedState, currentPassword);

            // 3. Re-encrypt state and verification with new password
            const newEncryptedState = await encrypt(decryptedState, newPassword);
            const newVerificationData = await encrypt('verification_string', newPassword);

            // 4. Update localStorage
            localStorage.setItem(ENCRYPTED_STATE_KEY, newEncryptedState);
            localStorage.setItem(VERIFICATION_KEY, newVerificationData);
            
            setStatus('success');
            play('achievement');

            // 5. Reload the app after a delay
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (err) {
            console.error(err);
            play('error');
            if ((err as Error).message.includes("Invalid password")) {
                setError(t('password_modal.error_wrong_password'));
            } else {
                setError(t('password_modal.error_generic'));
            }
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (status === 'success') {
            return (
                <div className="text-center p-4">
                    <Icon name="check" className="w-12 h-12 text-[var(--text-primary)] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-secondary)]">{t('password_modal.success_title')}</h3>
                    <p className="text-[var(--text-muted)] mt-2">{t('password_modal.success_message')}</p>
                </div>
            );
        }

        return (
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1" htmlFor="current-password">{t('password_modal.current_password')}</label>
                    <input id="current-password" type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] border border-[var(--border-secondary)] focus:ring-1 focus:ring-[var(--border-accent)]" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1" htmlFor="new-password">{t('password_modal.new_password')}</label>
                    <input id="new-password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] border border-[var(--border-secondary)] focus:ring-1 focus:ring-[var(--border-accent)]" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1" htmlFor="confirm-password">{t('password_modal.confirm_new_password')}</label>
                    <input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[var(--surface-tertiary)] p-2 rounded-none text-[var(--text-secondary)] border border-[var(--border-secondary)] focus:ring-1 focus:ring-[var(--border-accent)]" required />
                </div>

                <div className="flex items-center gap-2">
                    <input id="show-password" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="h-4 w-4 rounded-none bg-[var(--surface-tertiary)] border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer" />
                    <label htmlFor="show-password" className="text-sm text-[var(--text-muted)] cursor-pointer">{t('auth.toggle_password_visibility')}</label>
                </div>

                {error && <p className="text-sm text-center text-[var(--text-danger)]">{error}</p>}

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={handleClose} className="px-5 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors">{t('cancel')}</button>
                    <button type="submit" disabled={status === 'loading' || !currentPassword || !newPassword || !confirmPassword} className="px-5 py-2 rounded-none bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold transition-all border border-[var(--border-accent)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed">
                        {status === 'loading' ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                        ) : t('password_modal.change_password_cta')}
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={handleClose}>
            <div className="bg-[var(--surface-primary)] rounded-none w-full max-w-md p-6 border border-[var(--border-accent)] shadow-[0_0_20px_var(--shadow-accent)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] flex items-center gap-2">
                        <Icon name="shield" className="w-6 h-6" />
                        {t('password_modal.title')}
                    </h2>
                     <button onClick={handleClose} className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] text-2xl leading-none transition-transform hover:rotate-90">&times;</button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default ChangePasswordModal;