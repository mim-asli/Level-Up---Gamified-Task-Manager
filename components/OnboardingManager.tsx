import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import OnboardingModal from './OnboardingModal.js';

const OnboardingManager: React.FC = () => {
    const { state } = useAppContext();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Ensure we only render on the client, where localStorage has been read
        setIsClient(true);
    }, []);

    // Render nothing until the state is loaded from localStorage client-side
    // or if the user has already completed onboarding.
    if (!isClient || state.hasCompletedOnboarding) {
        return null;
    }

    return <OnboardingModal />;
};

export default OnboardingManager;
