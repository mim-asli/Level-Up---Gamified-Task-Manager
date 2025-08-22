import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import Icon from '../Icon.js';

interface GuideStep {
    targetId?: string;
    titleKey: string;
    descKey: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const GUIDE_STEPS: GuideStep[] = [
    {
        targetId: 'guide-target-command-center',
        titleKey: 'onboarding_guide.step1_title',
        descKey: 'onboarding_guide.step1_desc',
        position: 'bottom',
    },
    {
        targetId: 'guide-target-add-task',
        titleKey: 'onboarding_guide.step2_title',
        descKey: 'onboarding_guide.step2_desc',
        position: 'top',
    },
    {
        titleKey: 'onboarding_guide.step3_title',
        descKey: 'onboarding_guide.step3_desc',
        position: 'center',
    },
    {
        titleKey: 'onboarding_guide.step4_title',
        descKey: 'onboarding_guide.step4_desc',
        position: 'center',
    },
    {
        titleKey: 'onboarding_guide.step5_title',
        descKey: 'onboarding_guide.step5_desc',
        position: 'center',
    },
];

const ProgressiveOnboarding: React.FC = () => {
    const { state, dispatch, t } = useAppContext();
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const currentStep = GUIDE_STEPS[stepIndex];

    useLayoutEffect(() => {
        if (!currentStep?.targetId) {
            setTargetRect(null);
            return;
        }

        const updateRect = () => {
            const element = document.getElementById(currentStep.targetId!);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            }
        };
        
        // Use a small timeout to ensure the element is painted
        const timer = setTimeout(updateRect, 50);
        window.addEventListener('resize', updateRect);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateRect);
        };
    }, [stepIndex, currentStep]);
    
    // Do not render if the user has dismissed the guide or hasn't completed the initial onboarding
    if (state.onboarding.guideDismissed || !state.hasCompletedOnboarding) {
        return null;
    }

    const handleNext = () => {
        if (stepIndex < GUIDE_STEPS.length - 1) {
            setStepIndex(prev => prev + 1);
        } else {
            handleFinish();
        }
    };
    
    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex(prev => prev - 1);
        }
    }

    const handleFinish = () => {
        dispatch({ type: 'DISMISS_ONBOARDING_GUIDE' });
    };

    const popoverStyle: React.CSSProperties = {};
    const spotlightStyle: React.CSSProperties = {};
    const isCentered = !targetRect || currentStep.position === 'center';

    if (targetRect) {
        const padding = 10;
        spotlightStyle.width = targetRect.width + padding * 2;
        spotlightStyle.height = targetRect.height + padding * 2;
        spotlightStyle.top = targetRect.top - padding;
        spotlightStyle.left = targetRect.left - padding;

        switch (currentStep.position) {
            case 'top':
                popoverStyle.bottom = window.innerHeight - targetRect.top + padding;
                popoverStyle.left = targetRect.left + targetRect.width / 2;
                popoverStyle.transform = 'translateX(-50%)';
                break;
            case 'left':
                popoverStyle.right = window.innerWidth - targetRect.left + padding;
                popoverStyle.top = targetRect.top + targetRect.height / 2;
                popoverStyle.transform = 'translateY(-50%)';
                break;
             case 'right':
                popoverStyle.left = targetRect.right + padding;
                popoverStyle.top = targetRect.top + targetRect.height / 2;
                popoverStyle.transform = 'translateY(-50%)';
                break;
            case 'bottom':
            default:
                popoverStyle.top = targetRect.bottom + padding;
                popoverStyle.left = targetRect.left + targetRect.width / 2;
                popoverStyle.transform = 'translateX(-50%)';
                break;
        }
    }
    
    return (
        <div className="fixed inset-0 z-50 animate-subtle-fade-in" aria-live="polite">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
            
            {!isCentered && (
                <div 
                    className="absolute rounded-none border-2 border-[var(--border-accent)] shadow-[0_0_30px_var(--shadow-accent)] transition-all duration-300 ease-in-out"
                    style={{...spotlightStyle, boxShadow: '0 0 0 9999px rgba(0,0,0,0.8)'}}
                ></div>
            )}

            <div 
                className={`fixed p-6 bg-[var(--surface-primary)] border border-[var(--border-accent)] shadow-2xl rounded-none w-full max-w-sm transition-all duration-300 ${isCentered ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}
                style={popoverStyle}
                role="dialog"
                aria-labelledby="guide-title"
                aria-describedby="guide-desc"
            >
                <button onClick={handleFinish} title={t('onboarding_guide.skip')} className="absolute top-2 end-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-transform hover:rotate-90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h3 id="guide-title" className="text-xl font-bold text-[var(--text-secondary)] mb-2">{t(currentStep.titleKey)}</h3>
                <p id="guide-desc" className="text-[var(--text-primary)] mb-4">{t(currentStep.descKey)}</p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         {GUIDE_STEPS.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === stepIndex ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-primary)]'}`}></div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {stepIndex > 0 && (
                             <button onClick={handleBack} className="bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] font-bold py-2 px-4 rounded-none transition-colors">
                                {t('onboarding_guide.back')}
                            </button>
                        )}
                        <button onClick={handleNext} className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-2 px-4 rounded-none transition-colors">
                           {stepIndex === GUIDE_STEPS.length - 1 ? t('onboarding_guide.finish') : t('onboarding_guide.next')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressiveOnboarding;