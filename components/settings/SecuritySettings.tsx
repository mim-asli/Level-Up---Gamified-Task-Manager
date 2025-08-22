import React, { useState, useRef } from 'react';
import Icon from '../Icon.js';
import { useAppContext } from '../../hooks/useAppContext.js';
import { useSounds } from '../../hooks/useSounds.js';
import ConfirmationModal from '../ConfirmationModal.js';
import ChangePasswordModal from './ChangePasswordModal.js';

const ENCRYPTED_STATE_KEY = 'levelUpEncryptedData';
const VERIFICATION_KEY = 'levelUpVerification';

const SecuritySettings: React.FC = () => {
    const { t } = useAppContext();
    const play = useSounds();
    const [isPurgeConfirmOpen, setIsPurgeConfirmOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
    const [fileToImport, setFileToImport] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClearData = () => {
        play('error');
        setIsPurgeConfirmOpen(true);
    };
    
    const confirmClearData = () => {
        localStorage.removeItem(ENCRYPTED_STATE_KEY);
        localStorage.removeItem(VERIFICATION_KEY);
        localStorage.removeItem('levelUpSalt');
        window.location.href = '/';
    };

    const handleExport = () => {
        play('click');
        try {
            const encryptedState = localStorage.getItem(ENCRYPTED_STATE_KEY);
            const verificationData = localStorage.getItem(VERIFICATION_KEY);

            if (!encryptedState || !verificationData) {
                alert("No data found to export.");
                return;
            }

            const dataToExport = JSON.stringify({
                encryptedState,
                verificationData
            }, null, 2);

            const blob = new Blob([dataToExport], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            link.download = `levelup_backup_${timestamp}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export failed:", err);
            alert("An error occurred during export.");
        }
    };

    const handleImportClick = () => {
        play('click');
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileToImport(file);
            setIsImportConfirmOpen(true);
        }
    };
    
    const confirmImport = () => {
        if (!fileToImport) return;
        
        play('add');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not readable text.");
                }
                const parsedData = JSON.parse(text);
                
                if (parsedData.encryptedState && parsedData.verificationData) {
                    localStorage.setItem(ENCRYPTED_STATE_KEY, parsedData.encryptedState);
                    localStorage.setItem(VERIFICATION_KEY, parsedData.verificationData);
                    
                    // Force a full reload to re-trigger the encryption gate
                    window.location.reload();
                } else {
                    throw new Error("Invalid backup file format.");
                }

            } catch (err) {
                console.error("Import failed:", err);
                play('error');
                alert(t('settings.import_error'));
            } finally {
                setIsImportConfirmOpen(false);
                setFileToImport(null);
                if(fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };
        reader.onerror = () => {
             alert(t('settings.import_error'));
        }
        reader.readAsText(fileToImport);
    };
    
    return (
        <>
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                    <Icon name="shield" className="w-6 h-6" />
                    {t('settings.security_title')}
                </h2>
                <p className="text-[var(--text-muted)] mb-4">{t('settings.data_management_encrypted_desc')}</p>

                <div className="space-y-4 pt-4 border-t border-[var(--border-primary)]">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                play('click');
                                setIsPasswordModalOpen(true);
                            }}
                            className="w-full sm:w-auto bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] font-bold py-2 px-4 rounded-none transition-colors border border-[var(--border-secondary)]"
                        >
                            {t('settings.change_password')}
                        </button>
                        <button
                            onClick={handleExport}
                            className="w-full sm:w-auto bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] font-bold py-2 px-4 rounded-none transition-colors border border-[var(--border-secondary)]"
                        >
                            {t('settings.export_data')}
                        </button>
                        <button
                            onClick={handleImportClick}
                            className="w-full sm:w-auto bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] font-bold py-2 px-4 rounded-none transition-colors border border-[var(--border-secondary)]"
                        >
                            {t('settings.import_data')}
                        </button>
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[var(--surface-danger)] p-6 rounded-none border border-[var(--border-danger)]">
                <h2 className="text-xl font-bold text-[var(--text-danger)] mb-2">{t('settings.danger_zone')}</h2>
                <p className="text-[var(--text-danger-muted)] mb-4">{t('settings.danger_zone_desc')}</p>
                <button
                    onClick={handleClearData}
                    className="bg-[var(--accent-danger)] hover:bg-[var(--accent-danger-hover)] text-[var(--accent-danger-text)] font-bold py-2 px-4 rounded-none transition-colors border border-[var(--border-danger)]"
                >
                    {t('settings.purge_data')}
                </button>
            </div>
            
            <ConfirmationModal
                isOpen={isPurgeConfirmOpen}
                onClose={() => setIsPurgeConfirmOpen(false)}
                onConfirm={confirmClearData}
                title={t('settings.purge_data')}
                message={t('settings.purge_data_confirm')}
                confirmText={t('reboot')}
            />

            <ConfirmationModal
                isOpen={isImportConfirmOpen}
                onClose={() => setIsImportConfirmOpen(false)}
                onConfirm={confirmImport}
                title={t('settings.import_confirm_title')}
                message={t('settings.import_confirm_message')}
                confirmText={t('settings.import_data')}
            />

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </>
    );
};

export default SecuritySettings;