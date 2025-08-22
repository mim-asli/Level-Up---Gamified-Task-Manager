import React, { useState, useEffect, useCallback } from 'react';
import { encrypt, decrypt } from '../../lib/crypto.js';
import PasswordPrompt from './PasswordPrompt.js';
import { t_standalone as t } from '../../i18n/index.js';

const VERIFICATION_KEY = 'levelUpVerification';
const ENCRYPTED_STATE_KEY = 'levelUpEncryptedData';
const SALT_KEY = 'levelUpSalt'; // For pre-v2 compatibility check

interface EncryptionGateProps {
    children: (masterPassword: string) => React.ReactNode;
}

type AuthStatus = 'pending' | 'needs_creation' | 'needs_unlock' | 'unlocked';

const EncryptionGate: React.FC<EncryptionGateProps> = ({ children }) => {
    const [authStatus, setAuthStatus] = useState<AuthStatus>('pending');
    const [masterPassword, setMasterPassword] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        // Check if data is already encrypted
        const verificationData = localStorage.getItem(VERIFICATION_KEY);
        // This checks for an old, unencrypted version. If it exists, force creation of a new, encrypted store.
        const oldStateExists = localStorage.getItem('levelUpAppState');
        const oldSaltExists = localStorage.getItem(SALT_KEY);

        if (verificationData && !oldStateExists && !oldSaltExists) {
            setAuthStatus('needs_unlock');
        } else {
            setAuthStatus('needs_creation');
        }
    }, []);

    const handleCreatePassword = async (password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // If old data exists, clear it before creating the new encrypted store.
            localStorage.removeItem('levelUpAppState');
            localStorage.removeItem(SALT_KEY);

            // Create a verification hash to check password validity on future loads
            const verificationData = await encrypt('verification_string', password);
            localStorage.setItem(VERIFICATION_KEY, verificationData);

            // Encrypt an empty initial state to start with
            const emptyState = JSON.stringify({});
            const encryptedInitialState = await encrypt(emptyState, password);
            localStorage.setItem(ENCRYPTED_STATE_KEY, encryptedInitialState);

            setMasterPassword(password);
            setAuthStatus('unlocked');
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlock = async (password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const verificationData = localStorage.getItem(VERIFICATION_KEY);
            if (!verificationData) {
                // Should not happen if logic is correct, but as a safeguard
                setAuthStatus('needs_creation');
                throw new Error("Verification data not found. Please create a new password.");
            }
            await decrypt(verificationData, password);
            // If decrypt succeeds, password is correct
            setMasterPassword(password);
            setAuthStatus('unlocked');
        } catch (e) {
            setError(t('auth.unlock_error'));
            console.error("Unlocking failed", e);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (authStatus === 'unlocked' && masterPassword) {
        return <>{children(masterPassword)}</>;
    }

    if (authStatus === 'needs_creation') {
        return (
            <PasswordPrompt
                mode="create"
                onSubmit={handleCreatePassword}
                isLoading={isLoading}
                error={error}
            />
        );
    }

    if (authStatus === 'needs_unlock') {
         return (
            <PasswordPrompt
                mode="unlock"
                onSubmit={handleUnlock}
                isLoading={isLoading}
                error={error}
            />
        );
    }

    // Render a pending/loading state while checking localStorage
    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
        </div>
    );
};

export default EncryptionGate;