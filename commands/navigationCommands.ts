import { registerCommand } from '../lib/commandRegistry.js';
import { Command } from '../types.js';
import { IconName } from '../components/Icon.js';

// A helper to avoid repeating boilerplate for nav commands
const registerNavCommand = (id: string, path: string, icon: IconName) => {
    registerCommand({
        id,
        title: `commands.${id}.title`,
        description: `commands.${id}.desc`,
        icon,
        section: 'commands.section.navigation',
        action: ({ navigate }) => navigate(path),
    });
};

registerNavCommand('nav_dashboard', '/', 'tasks');
registerNavCommand('nav_goals', '/goals', 'goal');
registerNavCommand('nav_calendar', '/calendar', 'calendar');
registerNavCommand('nav_journal', '/journal', 'journal');
registerNavCommand('nav_coach', '/coach', 'sparkle');
registerNavCommand('nav_rewards', '/rewards', 'gift');
registerNavCommand('nav_skills', '/skills', 'git-branch');
registerNavCommand('nav_squads', '/squads', 'shield');
registerNavCommand('nav_armory', '/armory', 'package');
registerNavCommand('nav_tags', '/tags', 'tag');
registerNavCommand('nav_leaderboard', '/leaderboard', 'users');
registerNavCommand('nav_achievements', '/achievements', 'trophy');
registerNavCommand('nav_progress', '/progress', 'bar-chart-2');
registerNavCommand('nav_guide', '/guide', 'help');
registerNavCommand('nav_settings', '/settings', 'settings');