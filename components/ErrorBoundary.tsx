
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Icon from './Icon.js';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const errorTranslations = {
    en: {
        title: "Kernel Panic",
        description: "A critical error was detected in the system. You can attempt to reboot the interface, or if the problem persists, purge local data and restart.",
        reboot: "Reboot Interface",
        purge: "Purge Data & Reboot",
    },
    fa: {
        title: "خطای بحرانی هسته",
        description: "یک خطای بحرانی در سیستم شناسایی شد. می‌توانید رابط کاربری را راه‌اندازی مجدد کنید، یا اگر مشکل ادامه داشت، داده‌های محلی را پاک کرده و دوباره راه‌اندازی کنید.",
        reboot: "راه‌اندازی مجدد رابط",
        purge: "پاکسازی داده‌ها و راه‌اندازی مجدد",
    }
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("FATAL_ERROR:", error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };
  
  private handleClearDataAndReset = () => {
    try {
        localStorage.removeItem('levelUpAppState'); // Old key
        localStorage.removeItem('levelUpEncryptedData');
        localStorage.removeItem('levelUpVerification');
        localStorage.removeItem('levelUpSalt');
    } catch (e) {
        console.error("Failed to clear local storage", e);
    }
    window.location.reload();
  }

  public render() {
    if (this.state.hasError) {
      // Basic language detection that works even if context is broken
      const lang = document.documentElement.lang === 'fa' ? 'fa' : 'en';
      const t = errorTranslations[lang];

      return (
        <div className="text-center py-20 px-4 bg-[var(--surface-danger)] rounded-none border border-[var(--border-danger)] flex flex-col items-center gap-6">
            <Icon name="error" className="w-16 h-16 text-[var(--text-danger)]" />
            <h1 className="text-3xl font-bold text-[var(--text-danger)]">{t.title}</h1>
            <p className="text-[var(--text-danger-muted)] max-w-md">
                {t.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                    onClick={this.handleReset}
                    className="px-6 py-3 rounded-none bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold transition-colors border border-[var(--border-accent)]"
                >
                    {t.reboot}
                </button>
                <button
                    onClick={this.handleClearDataAndReset}
                    className="px-6 py-3 rounded-none bg-[var(--accent-danger)] hover:bg-[var(--accent-danger-hover)] text-[var(--accent-danger-text)] font-bold transition-colors border border-[var(--border-danger)]"
                >
                    {t.purge}
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;