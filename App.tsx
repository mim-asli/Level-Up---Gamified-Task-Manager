import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext.js';
import { useAppContext } from './hooks/useAppContext.js';
import Header from './components/Header.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import GlobalCommandHotkeys from './components/GlobalCommandHotkeys.js';
import EncryptionGate from './components/auth/EncryptionGate.js';

import './commands/index.js'; // This registers all commands on app startup.

import Dashboard from './pages/Dashboard.js';
import CalendarPage from './pages/CalendarPage.js';
import AllTasks from './pages/AllTasks.js';
import Journal from './pages/Journal.js';
import AICoach from './pages/AICoach.js';
import Achievements from './pages/Achievements.js';
import AchievementNotifier from './components/AchievementNotifier.js';
import GoalsPage from './pages/GoalsPage.js';
import GuidePage from './pages/GuidePage.js';
import SettingsPage from './pages/SettingsPage.js';
import Leaderboard from './pages/Leaderboard.js';
import LevelUpNotifier from './components/LevelUpNotifier.js';
import OnboardingManager from './components/OnboardingManager.js';
import CommandPalette from './components/CommandPalette.js';
import ProgressPage from './pages/ProgressPage.js';
import RewardsPage from './pages/RewardsPage.js';
import TagsListPage from './pages/TagsListPage.js';
import TagDetailPage from './pages/TagDetailPage.js';
import SkillsPage from './pages/SkillsPage.js';
import SquadsPage from './pages/SquadsPage.js';
import ArmoryPage from './pages/ArmoryPage.js';
import IntelCacheNotifier from './components/IntelCacheNotifier.js';
import SkillMentorPage from './pages/SkillMentorPage.js';


const ThemeManager: React.FC = () => {
  const { state } = useAppContext();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return null;
};

const LanguageManager: React.FC = () => {
    const { language } = useAppContext();
    
    useEffect(() => {
        try {
            localStorage.setItem('levelUpLanguage', language);
        } catch (e) {
            console.error("Failed to save language to localStorage", e);
        }
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }, [language]);

    return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main key={location.pathname} className="flex-grow container mx-auto p-4 sm:p-6 md:p-8 page-content">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/coach" element={<AICoach />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/skills/:skillName" element={<SkillMentorPage />} />
            <Route path="/squads" element={<SquadsPage />} />
            <Route path="/armory" element={<ArmoryPage />} />
            <Route path="/tags" element={<TagsListPage />} />
            <Route path="/tags/:tagName" element={<TagDetailPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <AchievementNotifier />
      <LevelUpNotifier />
      <IntelCacheNotifier />
      <OnboardingManager />
      <CommandPalette />
    </div>
  );
};


const FullApp: React.FC<{ masterPassword: string}> = ({ masterPassword }) => {
    return (
        <AppProvider masterPassword={masterPassword}>
          <HashRouter>
            <ThemeManager />
            <LanguageManager />
            <GlobalCommandHotkeys />
            <AppContent />
          </HashRouter>
        </AppProvider>
    );
}


const App: React.FC = () => {
  return (
    <EncryptionGate>
        {(masterPassword) => <FullApp masterPassword={masterPassword} />}
    </EncryptionGate>
  );
};

export default App;