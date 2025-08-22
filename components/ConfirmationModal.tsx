
import React from 'react';
import Icon from './Icon.js';
import { useAppContext } from '../hooks/useAppContext.js';
import { useModalKeyControls } from '../hooks/useModalKeyControls.js';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText,
    cancelText
}) => {
  const { t } = useAppContext();
  useModalKeyControls(isOpen, onClose);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="confirmation-title" aria-describedby="confirmation-message">
      <div 
        className="bg-[var(--surface-primary)] rounded-none w-full max-w-md p-6 border border-[var(--border-danger)] shadow-[0_0_20px_var(--shadow-danger)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirmation-title" className="text-xl font-bold text-[var(--text-danger)] flex items-center gap-2 mb-4">
          <Icon name="error" className="w-6 h-6" />
          {title}
        </h2>
        <p id="confirmation-message" className="text-[var(--text-secondary)] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2 rounded-none bg-[var(--interactive-muted)] hover:bg-[var(--interactive-muted-hover)] text-[var(--interactive-muted-text)] transition-colors"
          >
            {cancelText || t('cancel')}
          </button>
          <button 
            onClick={onConfirm} 
            className="px-5 py-2 rounded-none bg-[var(--accent-danger)] hover:bg-[var(--accent-danger-hover)] text-[var(--accent-danger-text)] font-bold transition-all border border-[var(--border-danger)]"
          >
            {confirmText || t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;