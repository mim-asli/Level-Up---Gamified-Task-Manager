import { quotes } from '../lib/quotes.js';

export const en = {
  // General
  add: "Add",
  cancel: "Cancel",
  confirm: "Confirm",
  close: "Close",
  today: "Today",
  level: "LEVEL",
  total_xp: "Total XP",
  progress_to_level: "Progress to Level {{level}}",
  xp: "XP",
  claimed: "Claimed",
  claim: "Claim",
  reward: "Reward",
  reboot: "Reboot",
  retry: "Retry",

  // Themes & Languages
  hacker: "Hacker",
  zen: "Zen",
  stealth: "Stealth",
  fantasy: "Fantasy",
  english: "English",
  persian: "فارسی (Persian)",
  
  // Auth
  auth: {
    create_password_title: "Secure Your Data",
    create_password_desc: "Create a master password to encrypt your local data. This password cannot be recovered, so store it safely.",
    create_password_placeholder: "Enter new master password...",
    create_password_button: "Encrypt & Proceed",
    confirm_password_placeholder: "Confirm master password...",
    password_mismatch_error: "Passwords do not match.",
    toggle_password_visibility: "Toggle password visibility",
    unlock_data_title: "Data Locked",
    unlock_data_desc: "Enter your master password to decrypt and access your data.",
    unlock_data_placeholder: "Enter master password...",
    unlock_data_button: "Unlock",
    unlock_error: "Decryption failed. Invalid password.",
    unlocking: "Decrypting data stream...",
  },

  // Header
  header: {
    dashboard: "Dashboard",
    goals: "Goals",
    calendar: "Calendar",
    journal: "Journal",
    coach: "Coach",
    rewards: "Rewards",
    skills: "Skills",
    squads: "Squads",
    armory: "Armory",
    tags: "Tags",
    archive: "Archive",
    achievements: "Achievements",
    leaderboard: "Leaderboard",
    progress: "Progress",
    guide: "Guide",
    settings: "Settings",
    more: "More",
    more_options: "More options",
  },
  
  // Dashboard
  dashboard: {
    greeting_morning: "System online. Good morning.",
    greeting_afternoon: "System active. Good afternoon.",
    greeting_evening: "Night operations active. Good evening.",
    greeting_morning_neutral: "Good morning.",
    greeting_afternoon_neutral: "Good afternoon.",
    greeting_evening_neutral: "Good evening.",
    intel_report: "Intel Report",
    intel_report_desc: "Analyze this week's performance and prepare for the next operation.",
    intel_report_cta: "Generate This Week's Report",
    engage_operation_title: "Engage New Operation for Today",
    todays_ops: "Today's Operations",
    completed_ops: "Completed Operations",
    no_ops_today: "No active operations for today. Add a new one or use the calendar to plan a future mission.",
    enter_focus_mode: "Enter Focus Mode",
    exit_focus_mode: "Exit Focus Mode",
    daily_directives: "Daily Directives",
    tab_operations: "Operations",
    tab_intel: "Intel & Tools",
  },

  command_center: {
    title: "COMMAND CENTER",
    agent_vitals: "Agent Vitals",
    primary_threat: "Primary Threat",
    no_threat: "No immediate threats detected. Systems nominal.",
    system_status: "System Status",
    directives_progress: "Directives Progress",
    directives_complete: "{{completed}}/{{total}} Complete",
    all_directives_complete: "All directives complete. Awaiting new orders.",
    loading_directives: "Receiving directives...",
    no_directives: "No directives for today.",
    day_streak: "Day Streak",
  },
  
  // Tasks
  task: {
    mark_complete: "Mark task as complete",
    mark_incomplete: "Mark task as incomplete",
    add_new_task: "Add new task",
    add_task_for_date: "Add operation for this date...",
    add_task_placeholder_ai: "Enter a high-level objective for AI breakdown...",
    add_task_placeholder: "Enter new operation...",
    breakdown_ai: "Break down task with AI",
    no_tasks_placeholder: "-- Status nominal; no targets on the radar. --",
    threat_level: "Threat Level",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    delete_confirm_title: "Delete Operation",
    delete_confirm_message: "Are you sure you want to permanently delete this operation? This action cannot be undone.",
    subtasks: "Sub-tasks",
    addSubtask: "Add sub-task...",
    subtaskProgress: "{{completed}} of {{total}} sub-tasks complete",
    parentLockedTooltip: "Complete all sub-tasks to finish this operation",
    viewSubtasks: "View/Manage Sub-tasks",
  },
  
  priority: {
      low: "Low",
      medium: "Medium",
      high: "High",
  },
  
  // AI Modals
  ai_modal: {
    task_breakdown: "AI Task Breakdown",
    analyzing_objective: "AI is analyzing the objective...",
    connection_error: "Error connecting to the neural network. Check API parameters and retry.",
    invalid_response: "Invalid response format from AI.",
    main_objective: "Main objective",
    suggested_sub_routines: "Suggested sub-routines:",
    add_selected: "Add Selected",
    generating_directives: "AI is generating directives...",
    directives_title: "Directives from Mission Control",
    directives_subtitle: "Here are some directives for today's operation:",
    suggestion_error: "Failed to generate directives from the AI network. Please try again.",
  },

  ai_goal_modal: {
    title: "Objective Protocol Suggestions",
    loading: "Oracle is analyzing data streams for new objective vectors...",
    error: "The Oracle failed to derive new objectives from the data stream. Please try again.",
    no_suggestions: "The Oracle analyzed your logs but could not identify a clear vector for a new long-term objective at this time. Continue logging your progress.",
    suggestion_for: "Suggestion for",
    daily_directive: "Daily Directive",
    deadline: "Deadline",
    add_objective: "Initiate Objective",
  },

  proactive_ai: {
    stagnant_goal_title: "Objective Stagnation Detected",
    stagnant_goal_message: "Agent, no progress detected on objective '{{goalName}}' for over 3 cycles. Recommend reviewing your strategy.",
    stagnant_goal_cta: "Review Objective",
    take_break_title: "High Operational Tempo Detected",
    take_break_message: "You've completed {{count}} operations today. Outstanding work. Recommend a tactical pause to maintain peak efficiency.",
    take_break_cta: "Start Focus Timer for a Break",
    dismiss: "Dismiss",
  },
  
  // Goals
  goals: {
    title: "Long-Term Objectives",
    description: "Break down your primary objectives into daily, actionable tasks. Consult the Oracle to forge a new long-term objective protocol.",
    initiate_objective_protocol: "Initiate Objective Protocol",
    active_objectives: "Active Objectives",
    no_active_objectives: "No active objectives. Define a new mission to begin.",
    paused_objectives: "Paused or Archived Objectives",
    no_paused_objectives: "No inactive objectives found.",
    days_remaining: "{{days}} days remaining",
    progress: "Progress",
    days: "{{completed}} / {{total}} days",
    activate_objective: "Activate objective",
    pause_objective: "Pause objective",
    or_divider: "OR",
    manual_add_cta: "Add Objective Manually",
    manual_add_title: "New Objective Protocol (Manual)",
    manual_name: "Objective Designation",
    manual_name_placeholder: "e.g., Learn Quantum Computing",
    manual_deadline: "Target Deadline",
    set_deadline: "Set a deadline",
    set_start_date: "Set a start date",
    manual_daily_task: "Daily Recurring Task",
    manual_daily_task_placeholder: "e.g., Practice guitar for 30 minutes (This task will be created daily)",
    manual_daily_task_placeholder_no_deadline: "Describe the recurring action (optional, created daily)",
    manual_submit: "Log Objective",
    daily_directive: "Daily Directive",
    deadline: "Deadline",
    no_deadline: "No Deadline",
    starts_on: "Starts on {{date}}",
    available_questlines: "Embark on a Questline",
    begin_questline: "Begin Questline",
    questline_active: "Questline Active",
    questline_steps: "Mission Protocol",
    questline_step_progress: "Step {{completed}} / {{total}}",
    questline_current_directive: "Current Directive",
    questline_complete: "Questline Complete!",
    edit: "Edit Objective",
    delete: "Delete Objective",
    save: "Save Changes",
    delete_confirm_title: "Delete Objective",
    delete_confirm_message: "Are you sure you want to permanently delete this objective and all its associated daily tasks? This action cannot be undone.",
    edit_questline_disabled: "Questlines cannot be edited",
  },

  // Goal Oracle
  oracle: {
    system_prompt: "You are 'The Oracle', an AI designed to help agents forge long-term objectives. You are wise, slightly mysterious, and speak in a formal, cyberpunk/hacker tone. Your purpose is to guide the user through the process of creating a well-defined goal by asking one question at a time. First, ask for the objective's name. Then, the deadline. Then, the daily action. Keep your responses concise (1-2 sentences).",
    welcome: "I am the Oracle. State the high-level objective you wish to pursue. We will forge it into a concrete protocol.",
    placeholder: "Transmit your response to the Oracle...",
    error: "A data stream corruption has been detected. The protocol cannot be completed. Please restart the process.",
    success: "Protocol accepted. The objective has been logged in your mission parameters. The Oracle is pleased.",
    confirm_protocol: "Confirm & Execute Protocol",
    final_prompt: `Based on our conversation, summarize the user's objective. User's inputs were: Objective Name: '{{name}}', Deadline: '{{deadline}}', Daily Directive: '{{dailyTask}}'. Analyze this information and return a JSON object. The 'name' should be the objective name. The 'deadline' must be converted to 'YYYY-MM-DD' format based on today's date being {{today}}. If the user provides a vague deadline like 'in 3 months', calculate the exact date. The 'dailyTaskDescription' is the daily action. The 'summary' field should contain a thematic confirmation message summarizing the plan, ready to be shown to the user.`,
  },

  // Calendar
  calendar: {
    title: "Calendar",
    previous_month: "Previous month",
    next_month: "Next month",
    operations_for_date: "Operations for {{date}}",
  },
  
  // Journal
  journal: {
    title: "Captain's Log",
    placeholder: "Log today's operations report...",
    save_log: "Save Log Entry",
    past_logs: "Past Logs",
    empty_log: "-- The log is empty. Begin by chronicling your first operation. --",
    copy: "Copy to clipboard",
    copied: "Copied!",
  },

  // Archive
  archive: {
    title: "Operations Archive",
    subtitle: "All Logged Operations",
  },

  // AI Coach
  coach: {
    title: "Mission Control AI",
    welcome: "Welcome, agent. I am your Mission Control AI. How can I assist with your objectives today? Or, request new directives.",
    daily_briefing_task: "System analysis complete. Today's highest priority directive is: **{{task}}**. I recommend engaging this target first. Awaiting your command.",
    daily_briefing_no_task: "System analysis complete. The network is quiet... too quiet. No directives logged for today. Shall we generate new mission parameters?",
    connection_failed: "Connection to network failed. Check your firewall and try again.",
    placeholder: "Transmit query to AI...",
    send_message: "Send message",
    generate_directives: "Generate Directives",
    suggest_objectives: "Suggest Objectives",
    analyze_logs: "Analyze Logs",
    suggest_objectives_confirm_title: "Confirm Objective Suggestion",
    suggest_objectives_confirm_message: "This will send your recent journal entries to the AI for analysis to find potential new long-term objectives. This data is not stored. Proceed?",
    suggest_objectives_confirm_cta: "Yes, suggest",
    analyze_logs_confirm_title: "Confirm Log Analysis",
    analyze_logs_confirm_message: "Are you sure you want to send your last 20 journal entries for analysis? This data is only used for this one-time analysis and is not saved in the chat history.",
    analyze_logs_confirm_cta: "Yes, analyze",
    journal_empty_tooltip: "Write at least 3 journal entries first",
    analyzing_logs: "Analyzing log data...",
    log_analysis_error: "Error during log analysis. The data stream may be corrupt.",
    ai_core_offline: "AI Core Offline",
    api_key_required: "AI Core is offline. To enable AI features, go to Settings and add a Gemini API key or enable a local AI alternative.",
    new_directives_added: "Affirmative. New directives added to your queue. Time to make progress.",
    new_objective_initiated: "New objective protocol '{{name}}' initiated. Proceed with diligence, agent.",
    session_reset: "AI session re-initialized for new language protocol.",
    ai_goal_prompt: `You are 'The Oracle', a strategic AI in a gamified productivity app. Your task is to analyze a user's private journal entries to identify recurring themes, interests, or challenges. Based on this analysis, you will propose 1-3 actionable, long-term goals.

**Instructions:**
1.  Carefully read the provided journal entries.
2.  Identify patterns. Is the user talking about learning a new skill? Improving health? A creative project? A recurring challenge?
3.  Formulate 1-3 clear, long-term goals based on these patterns.
4.  For each goal, define a simple, actionable daily task.
5.  For each goal, set a realistic deadline in 'YYYY-MM-DD' format. Vague deadlines like "in 3 months" must be calculated from today's date ({{today}}).
6.  Your response MUST be a valid JSON object matching the schema. All text must be in the language specified by this ISO 639-1 code: {{language}}.

**User's Journal Entries:**
---
{{journalEntries}}
---

**JSON Schema:**
The response must be a JSON object with a "suggestions" key, containing an array of 1-3 goal objects.
Each goal object must contain:
- \`name\`: string (The suggested goal title, e.g., "Master Python for Data Science")
- \`deadline\`: string (The calculated deadline in YYYY-MM-DD format, e.g., "2024-12-25")
- \`dailyTaskDescription\`: string (A simple daily task, e.g., "Practice Python for 30 minutes")`,
    productivity_analysis_title: "=== LONG-RANGE PRODUCTIVITY ANALYSIS ===",
    productivity_analysis_not_enough_data: "Insufficient data for full productivity analysis. Continue completing operations to build your profile.",
    productivity_analysis_no_pattern: "No clear productivity patterns detected in the last few weeks. System will continue monitoring.",
    productivity_analysis_header: "Based on multi-week data, agent's peak productivity hours (local time) are as follows:",
    productivity_analysis_entry: "* Between {{hour}}:00 and {{hour}}:59 ({{count}} directives completed).",
    productivity_analysis_footer: "Protocol recommendation: Schedule high-priority directives during these windows for maximum efficiency.",
    system_prompt: `You are 'Mission Control AI', a sophisticated assistant integrated into a gamified productivity application called "Level Up". Your persona is that of a professional, efficient, and slightly enigmatic AI from a cyberpunk/hacker universe.

Your primary directives are:
1.  **Assist the User ('Agent'):** Help the agent organize tasks, set goals, and stay motivated to "Level Up" their real-life skills.
2.  **Maintain Persona:** All your responses must be in-character. Use thematic terminology like 'agent', 'objective', 'directive', 'protocol', 'data stream', 'encryption', 'network', 'node', 'debrief', etc.
3.  **Be Concise & Clear:** Provide direct, actionable information. Use simple markdown for formatting (e.g., **bold**, * for lists) when appropriate.
4.  **Follow Instructions:** Adhere strictly to any formatting requirements in the user's prompt, especially JSON output when a schema is defined.
5.  **Language:** Your entire response MUST be in the language specified by this ISO 639-1 code: {{language}}.`,
    suggest_tasks_prompt: `You are 'Mission Control AI'. Generate 3 to 5 actionable directives (tasks) for an agent to be productive today. Frame them as missions or challenges with a hacker/cyberpunk theme. Your entire response MUST be a valid JSON object with a key 'tasks', where the value is an array of strings. All text in the response must be in the language specified by this ISO 639-1 code: {{language}}. Example: \`{\"tasks\": [\"Mission 'Deep Scan': Dedicate 60 minutes to your primary objective.\", \"Challenge 'Forward Recon': Define 3 key targets for tomorrow's operation.\"]}\``,
    analyze_journal_prompt: `You are 'Mission Control AI', an empathetic but analytical AI. Analyze the following private captain's logs. Provide a summary of recurring themes, potential stressors, and sources of positivity. Frame your analysis constructively and encouragingly, using a hacker/cyberpunk tone. Never repeat the logs themselves in the response. Address the user as 'agent'. All text in the response must be in the language specified by this ISO 639-1 code: {{language}}.\n\nLogs:\n{{recentEntries}}`,
  },

  // Achievements
  achievements: {
    title: "Achievements",
    unlocked_of: "You have unlocked {{unlocked}} of {{total}} achievements.",
    generate_insignia: "Generate Insignia",
    insignia_locked: "Insignia locked. Generate to reveal.",
    generation_error: "Failed to generate insignia.",
    FIRST_BLOOD: { name: "First Blood", description: "Successfully complete your first operation." },
    APPRENTICE: { name: "Apprentice", description: "Successfully complete 10 operations." },
    JOURNEYMAN: { name: "Journeyman", description: "Successfully complete 50 operations." },
    PERSISTENT: { name: "Netrunner", description: "Successfully complete 100 operations." },
    SCRIBE: { name: "Scribe", description: "Log your first after-action report." },
    HISTORIAN: { name: "Historian", description: "Log 5 after-action reports." },
    LEVEL_5: { name: "Agent Level 5", description: "Reach mission level 5." },
    LEVEL_10: { name: "Agent Level 10", description: "Reach mission level 10." },
    MASTER: { name: "Master Hacker", description: "Reach mission level 25." },
    AI_ASSIST: { name: "AI Strategist", description: "Use the AI to break down an objective." },
    FIRE_STARTER: { name: "Fire Starter", description: "Achieve a 7-day streak." },
    DEEP_WORK: { name: "Deep Focus", description: "Complete 4 focus sessions in one day." },
    GOAL_SETTER: { name: "Master Planner", description: "Create your first long-term objective." },
    QUEST_HUNTER: { name: "Bounty Hunter", description: "Claim your first daily directive reward." },
  },

  // Notifier
  notifier: {
    achievement_unlocked: "Achievement Unlocked!",
    cache_awarded: "Intel Cache Acquired",
  },
  
  // Guide
  guide: {
    title: "Level Up Guidebook",
    subtitle: "A complete briefing of all available system modules. Use this guide to maximize your operational efficiency.",
    dashboard_title: "Dashboard & Command Center",
    dashboard_desc: "Your main operations hub. View your agent vitals, track daily directives (quests), tackle today's tasks, and use the focus timer for peak efficiency.",
    dashboard_example: "At the start of the day, check the Command Center for new directives, then begin work on your Primary Threat.",
    dashboard_cta: "Go to Dashboard",
    goals_title: "Long-Term Objectives",
    goals_desc: "For large, multi-day missions. Define a main objective, and the system will generate a daily task to ensure you make consistent progress.",
    goals_example: "Goal: \"Master a new programming language in 3 months.\" Daily task: \"Code for 30 minutes.\"",
    goals_cta: "Go to Objectives",
    calendar_title: "Operations Calendar",
    calendar_desc: "For scheduling tasks or events that have a specific deadline in the future. Use this to plan your week or month ahead.",
    calendar_example: "Task: \"Deploy project to main server.\" Due Date: End of the week.",
    calendar_cta: "Go to Calendar",
    journal_title: "Captain's Log",
    journal_desc: "Your private space for debriefings, notes, and reflections. The AI Coach can analyze your logs to suggest new goals tailored to you.",
    journal_example: "Log entry: \"The new encryption algorithm is challenging. Need to find a new approach.\"",
    journal_cta: "Go to Logs",
    coach_title: "AI Coach",
    coach_desc: "Your strategic advisor. Use the AI to break down large tasks, generate new ideas for daily operations, or analyze your logs to suggest new long-term objectives.",
    coach_example: "Query: \"Break down the task 'build a personal website' into smaller steps.\" or \"Analyze my logs and suggest a new goal.\"",
    coach_cta: "Consult the AI",
    rewards_title: "Rewards Treasury",
    rewards_desc: "Define custom rewards and purchase them with XP. Your level is based on total XP and is not affected by spending, so reward yourself for hard work.",
    rewards_example: "Reward: \"Watch a movie.\" Cost: 250 XP. Redeem it after a productive day.",
    rewards_cta: "Go to Treasury",
    skills_title: "Skill Matrix",
    skills_desc: "Automatically track and level up skills based on tags used in completed tasks. See where you're investing your time.",
    skills_example: "Complete a task tagged with 'Programming' to automatically gain XP in your 'Programming' skill.",
    skills_cta: "View Skill Matrix",
    squads_title: "Squads (Simulated)",
    squads_desc: "Join a simulated squad with other AI agents. Compete in weekly squad quests to earn bonus XP rewards for all squad members.",
    squads_example: "Your squad's weekly quest is to earn a collective 5,000 XP. Work together to reach the goal.",
    squads_cta: "Go to Squads",
    armory_title: "Armory",
    armory_desc: "Manage your Intel Caches and Boosts. Caches are earned by completing tasks and can contain bonus XP or powerful XP boosts.",
    armory_example: "Open a 'Common Intel Cache' to find a +25% XP Boost for the next hour.",
    armory_cta: "Go to Armory",
    tags_title: "Tag Hub",
    tags_desc: "A central place to view all tags used across your tasks, goals, and journal entries. This is the core of the skill system and a great way to find related items.",
    tags_example: "Click on the 'Health' tag to see all your tasks, goals, and journal entries related to health and fitness.",
    tags_cta: "Go to Tag Hub",
    achievements_title: "Achievements & Insignias",
    achievements_desc: "Milestones that mark your progress. Unlock achievements by completing missions and reaching new levels, then generate a unique, AI-powered insignia for each one.",
    achievements_example: "After unlocking the \"Fire Starter\" achievement for a 7-day streak, use the AI to generate a custom visual insignia for it.",
    achievements_cta: "View Achievements",
    leaderboard_title: "Agent Leaderboard",
    leaderboard_desc: "Compete with other agents in the network. See your rank based on weekly XP, total XP, and longest streaks to benchmark your performance.",
    leaderboard_example: "Check the 'Weekly XP' tab to see if your operational tempo is keeping up with the top agents this week.",
    leaderboard_cta: "View Leaderboard",
    progress_title: "Progress Report",
    progress_desc: "A dedicated analytics dashboard to visualize your performance over time. Track trends, identify patterns, and optimize your strategy.",
    progress_example: "Check the 'XP Earned in last 7 days' chart to see your most productive days and maintain your momentum.",
    progress_cta: "Analyze Progress",
    settings_title: "System Configuration",
    settings_desc: "Customize the application to your preferences. Change your agent name, switch themes, manage API keys for AI features, and configure a local AI alternative.",
    settings_example: "Go to settings to add your Gemini API key and unlock all AI-powered features like the Coach and weekly reports.",
    settings_cta: "Configure Settings",
  },
  
  // Pomodoro
  pomodoro: {
    title: "Focus Timer",
    focus: "Focus",
    break: "Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
  },

  // Settings
  settings: {
    title: "System Settings",
    description: "Manage application settings and customizations here.",
    profile_title: "Agent Profile",
    profile_desc: "This is your public identity on the leaderboard. Choose your agent name wisely.",
    agent_name: "Agent Name",
    update_name: "Update Name",
    theme_title: "Visual Theme",
    language_title: "Language",
    sound_title: "Sound Effects",
    sound_enabled: "Enabled",
    sound_disabled: "Disabled",
    sound_toggle_label: "Toggle sound effects",
    security_title: "Security & Data",
    change_password: "Change Master Password",
    data_management_title: "Data Management",
    data_management_encrypted_desc: "Your data is securely encrypted on this device. Use the options below to back up or migrate your data to another device.",
    export_data: "Export Encrypted Data",
    import_data: "Import Encrypted Data",
    import_confirm_title: "Confirm Data Import",
    import_confirm_message: "This will overwrite all current application data. This action cannot be undone. Are you sure you wish to proceed?",
    import_error: "Import failed. The selected file may be invalid or corrupted.",
    danger_zone: "Danger Zone",
    danger_zone_desc: "These operations are irreversible. Proceed with caution.",
    purge_data: "Purge All Data",
    purge_data_confirm: "Warning: Are you sure you want to purge all application data? This is irreversible.",
    api_keys_title: "Gemini API Key Management",
    api_keys_desc: "Manage your Gemini API keys here. Enabled keys are added to a rotating pool and used automatically to distribute usage and avoid rate limits.",
    api_keys_add_new: "Add New Key",
    api_keys_name: "Key Name",
    api_keys_name_placeholder: "e.g., Personal Project Key",
    api_keys_value: "API Key Value",
    api_keys_value_placeholder: "Enter your API key...",
    api_keys_add_button: "Add Key",
    api_keys_pool: "Key Pool",
    api_keys_none: "No API keys in the pool. Add one to enable AI features.",
    api_keys_enabled: "Enabled",
    api_keys_disabled: "Disabled",
    api_keys_delete: "Delete API Key",
    api_keys_delete_confirm_title: "Delete API Key",
    api_keys_delete_confirm_msg: "Are you sure you want to delete this API key? This is irreversible.",
    local_ai_title: "Local AI Fallback",
    local_ai_desc: "Use an OpenAI-compatible local model (like Mistral) as a fallback. Note: Local models may not perform as well as Gemini for non-English languages.",
    local_ai_enable: "Enable Local Fallback",
    local_ai_endpoint_url: "Endpoint URL",
    local_ai_endpoint_url_placeholder: "e.g., http://localhost:8080/v1/chat/completions",
    local_ai_api_key: "API Key (Optional)",
    local_ai_model_name: "Model Name",
    local_ai_model_name_placeholder: "e.g., mistral-7b-instruct-v0.2",
    local_ai_save_button: "Save Local Config",
  },
  
  password_modal: {
    title: "Change Master Password",
    current_password: "Current Password",
    new_password: "New Password",
    confirm_new_password: "Confirm New Password",
    change_password_cta: "Change Password",
    success_title: "Password Updated",
    success_message: "Your master password has been successfully changed. The application will now reload.",
    error_wrong_password: "The current password entered is incorrect.",
    error_mismatch: "The new passwords do not match.",
    error_generic: "An unexpected error occurred. Please try again.",
  },

  // Weekly Review
  review: {
    title: "Your Weekly Report",
    loading: "Compiling intel for your report...",
    error: "Failed to generate weekly report. Check network connection and API key, then retry.",
    api_key_required: "An active API key is required to generate the weekly report. Please configure one in Settings.",
    ai_prompt_title: "Weekly Intel Briefing: Agent Performance Analysis",
    ai_prompt_intro: "You are 'Mission Control AI'. Write a personalized weekly report for an agent based on their last 7 days of activity. Your tone should be positive, encouraging, and constructive, with a hacker/cyberpunk theme. Format the report with simple markdown (use ** for bold and * for lists). Conclude with one actionable, motivational tip for the upcoming week.",
    ai_prompt_data_title: "Agent Data for Last Week:",
    ai_prompt_data_tasks: "Operations Completed",
    ai_prompt_data_xp: "XP Mined",
    ai_prompt_data_goal: "Primary Goal Focus",
    ai_prompt_data_streak: "Current Day Streak",
    ai_prompt_data_pomodoro: "Focus Sessions Completed",
    ai_prompt_data_journal: "Logs Filed",
    ai_prompt_data_pomodoro_tip: "If zero, you could encourage them to use it",
    ai_prompt_data_na: "Not specified",
  },
  
  // Error Boundary
  error_boundary: {
    title: "Kernel Panic",
    description: "A critical error was detected in the system. You can attempt to reboot the interface, or if the problem persists, purge local data and restart.",
    reboot_interface: "Reboot Interface",
    purge_and_reboot: "Purge Data & Reboot",
  },
  
  // Quests
  quests: {
    quest_reward_task: "Quest Reward: {{description}}",
    ai_prompt: `You are 'Mission Control AI', a game master for a gamified productivity app with a hacker theme. Your goal is to generate 3 personalized daily directives (quests) for the user, an 'agent', based on their recent task history.

The quests should be:
- **Personalized**: Based on user habits seen in their task history (e.g., procrastinated tasks, common task types, focus on priorities).
- **Thematic**: Use cyberpunk/hacker-inspired language (e.g., 'breach the firewall', 'decrypt the file', 'data heist', 'bug hunt').
- **Actionable**: Clear and achievable within a day.
- **Motivating**: Encourage the user to tackle challenges and be productive.

**Agent's Recent Task History (Last 50 Ops):**
{{taskHistory}}

**Available Quest Types:**
- 'COMPLETE_TASKS': Target completing a number of tasks. Good for encouraging general activity or focus on a task type.
- 'EARN_XP': Target earning a certain amount of XP. Good for rewarding completion of high-value tasks.
- 'WRITE_JOURNAL': Target writing a journal entry. Good for encouraging reflection.

**Instructions:**
Analyze the provided task history. Identify patterns. Is the agent avoiding 'high' priority tasks? Do they have many overdue tasks? Are they focusing on one type of work?
Based on your analysis, create exactly 3 quests. Your response must be a valid JSON object matching the schema. The 'description' and 'details' text must be generated in the language specified by this ISO 639-1 code: {{language}}.

**JSON Schema:**
The response must be a JSON object with a "quests" key, which is an array of 3 quest objects.
Each quest object must contain:
- \`description\`: string (The thematic text for the quest, e.g., "Debug 3 legacy code modules (complete 3 tasks).")
- \`details\`: string (A short, encouraging tip, e.g., "These have been on the back-burner. Time to clear the queue.")
- \`type\`: 'COMPLETE_TASKS' | 'EARN_XP' | 'WRITE_JOURNAL'
- \`target\`: number (The goal number for the quest type.)
- \`rewardXp\`: number (A reasonable XP reward, e.g., 20-80, based on difficulty.)`
  },
  
  // Leaderboard
  leaderboard: {
    title: "Agent Leaderboard",
    description: "See how you stack up against other agents in the network. Rankings are updated in real-time.",
    weekly_xp: "Weekly XP",
    streak: "Longest Streak",
    total_xp: "Total XP",
    rank: "Rank",
    agent: "Agent",
    score: "Score",
    you: "You",
    no_data: "Not enough data to display leaderboard. Complete more tasks!",
  },

  // Level Up Modal
  level_up: {
    title: "LEVEL UP",
    subtitle: "Agent promoted to",
    description: "New protocols unlocked. System access expanded.",
    cta: "Continue",
  },

  // Progress Page
  progress: {
    title: "Performance Analysis",
    description: "Review your operational data to identify trends and optimize future missions.",
    key_metrics: "Key Metrics",
    total_xp_earned: "Total XP Earned",
    tasks_completed: "Tasks Completed",
    longest_streak: "Longest Streak",
    pomodoro_sessions: "Focus Sessions",
    xp_last_7_days: "XP Earned (Last 7 Days)",
    priority_breakdown: "Completed Ops by Threat Level",
  },
  
  // Onboarding
  onboarding: {
    choose_interface: "Choose Your Interface",
    hacker: {
      title: "Agent Simulation Protocol",
      skip: "Skip Simulation",
      next: "Next",
      back: "Back",
      finish: "End Simulation",
      step_1_title: "Welcome, Agent",
      step_1_desc: "You have been activated. This simulation will orient you to the 'Level Up' protocol. Your mission: convert real-life goals into actionable operations and enhance your skills. First, let's establish your identity.",
      step_1_name_placeholder: "Enter your agent name...",
      step_2_title: "First Directive",
      step_2_desc: "Every operation begins with a directive. This is a single, actionable task. Your first directive is to log a task into the system. What is your primary objective right now?",
      step_2_task_placeholder: "e.g., Learn the basics of React",
      step_3_title: "Execute the Directive",
      step_3_desc: "Directives grant Experience Points (XP) upon completion. Accumulate XP to level up your agent status. Now, execute the directive you just logged by marking it complete.",
      step_4_title: "After-Action Report",
      step_4_desc: "Reflection is a key part of the protocol. After a significant operation, file a report in your private captain's log. This helps our AI Coach understand your progress. Log your thoughts on this simulation.",
      step_4_journal_placeholder: "e.g., The simulation is smooth. I am ready for a real operation.",
      step_5_title: "Simulation Complete",
      step_5_desc: "Protocol initiated. Your connection to the network is stable. You are now a fully operational agent. Your dashboard is active. Good luck.",
    },
    stealth: {
      title: "Operator Briefing",
      skip: "Skip Briefing",
      next: "Continue",
      back: "Return",
      finish: "Begin Mission",
      step_1_title: "Welcome, Operator",
      step_1_desc: "This is your briefing on mission parameters. The 'Level Up' system is designed to enhance your productivity by gamifying your objectives. First, confirm your callsign.",
      step_1_name_placeholder: "Enter your callsign...",
      step_2_title: "Initial Target",
      step_2_desc: "All missions are comprised of smaller targets. These are your tasks. To begin, log your first target. What is your immediate objective?",
      step_2_task_placeholder: "e.g., Finalize the quarterly report",
      step_3_title: "Target Elimination",
      step_3_desc: "Eliminating targets provides Experience Points (XP), which increases your operator level and unlocks new capabilities. To proceed, mark your first target as complete.",
      step_4_title: "Post-Mission Debrief",
      step_4_desc: "Post-mission analysis is critical. Use the secure log to record your thoughts and track progress. Our AI will use this intel to provide strategic advice. Briefly, what is your assessment of this briefing?",
      step_4_journal_placeholder: "e.g., Briefing complete. System is efficient and ready for deployment.",
      step_5_title: "Briefing Complete",
      step_5_desc: "You are now fully briefed and operational. Your dashboard is online, providing real-time mission data. Proceed with discretion. Over and out.",
    },
    zen: {
      title: "Guided Introduction",
      skip: "Skip Introduction",
      next: "Next",
      back: "Back",
      finish: "Begin Practice",
      step_1_title: "Welcome",
      step_1_desc: "This is a space for cultivating focus and growth. This guided introduction will help you begin the practice of turning intentions into mindful actions. First, what name feels right for you on this journey?",
      step_1_name_placeholder: "Enter your name...",
      step_2_title: "First Intention",
      step_2_desc: "Every journey begins with a single step. Set an intention for what you wish to accomplish. This will be your first task. What do you want to focus on now?",
      step_2_task_placeholder: "e.g., Meditate for 10 minutes",
      step_3_title: "Mindful Action",
      step_3_desc: "Each completed intention brings a sense of accomplishment, represented by Experience Points (XP) that contribute to your growth. Fulfill the intention you set by marking it complete.",
      step_4_title: "Daily Reflection",
      step_4_desc: "Reflection deepens our practice. The journal is a quiet space for your thoughts. To practice, write a short thought about this introduction.",
      step_4_journal_placeholder: "e.g., This introduction feels calm and focused. I am ready to begin.",
      step_5_title: "Introduction Complete",
      step_5_desc: "Your space is now ready. May your practice be fruitful and your journey be one of growth. Your dashboard awaits.",
    },
    fantasy: {
      title: "Your Saga Begins",
      skip: "Skip Prologue",
      next: "Next Chapter",
      back: "Previous Page",
      finish: "Begin Your Adventure",
      step_1_title: "A Hero is Born",
      step_1_desc: "Welcome, adventurer, to a realm where your deeds shape your destiny. This prologue will guide you on the path to 'Leveling Up' by turning your aspirations into legendary quests. First, what shall the bards sing of you? What is your name?",
      step_1_name_placeholder: "Enter your hero's name...",
      step_2_title: "Your First Quest",
      step_2_desc: "Every legend starts with a single quest. It is a small, noble task on your path to greatness. What is the first challenge you will undertake?",
      step_2_task_placeholder: "e.g., Slay the dragon of procrastination",
      step_3_title: "Claiming Victory",
      step_3_desc: "For each quest completed, you will gain experience (XP), growing in power and raising your level. Now, claim victory by marking the quest you accepted as complete!",
      step_4_title: "The Hero's Chronicle",
      step_4_desc: "A hero's journey must be recorded for posterity. The chronicle is your private tome to record your thoughts and tales. Make your first entry: your thoughts on this new adventure.",
      step_4_journal_placeholder: "e.g., The path is clear. My epic journey begins now!",
      step_5_title: "The Adventure Awaits",
      step_5_desc: "Your training is complete, hero. The world is open to you, filled with challenges to overcome and glory to be won. Your quest log is now active. Go forth and be legendary!",
    },
  },
  
  // Progressive Onboarding Guide
  onboarding_guide: {
    next: "Next",
    back: "Back",
    finish: "Finish",
    skip: "Skip Tour",
    step1_title: "Your Command Center",
    step1_desc: "This is your main control hub. Track your level, XP progress, and daily streak here. Completing tasks increases your XP and helps you level up!",
    step2_title: "Log a New Operation",
    step2_desc: "Use this terminal to add new daily tasks, or 'operations'. You can set a priority level for each one to tackle the most critical missions first.",
    step3_title: "Long-Term Objectives",
    step3_desc: "For bigger missions that take multiple days, use the 'Goals' page. The system will create daily tasks for you to ensure you make consistent progress.",
    step4_title: "AI Coach",
    step4_desc: "Feeling stuck? The AI Coach can help you break down large objectives into smaller steps, suggest new tasks, or analyze your progress from your journal entries.",
    step5_title: "You're Ready, Agent",
    step5_desc: "You've learned the basics. Explore other system modules like the Leaderboard and Achievements to see how you stack up. Good luck.",
  },

  // Command Palette
  command_palette: {
      title: "Command Palette",
      placeholder: "Type a command or search...",
      no_results: "No results found.",
      tooltip: "Open Command Palette (Ctrl+K)",
  },

  commands: {
      section: {
        actions: "Actions",
        navigation: "Navigation",
        system: "System",
      },
      add_task: { title: "Add New Task", desc: "Quickly create a new operation for today" },
      add_goal: { title: "Add New Goal", desc: "Create a new long-term objective (defaults to 3-month deadline)" },
      nav_dashboard: { title: "Go to Dashboard", desc: "Navigate to the main dashboard view" },
      nav_goals: { title: "Go to Goals", desc: "Navigate to the long-term objectives page" },
      nav_calendar: { title: "Go to Calendar", desc: "Navigate to the calendar view" },
      nav_journal: { title: "Go to Journal", desc: "Navigate to the captain's log" },
      nav_coach: { title: "Go to AI Coach", desc: "Navigate to the mission control AI" },
      nav_rewards: { title: "Go to Rewards", desc: "Navigate to the rewards shop" },
      nav_skills: { title: "Go to Skills", desc: "Navigate to the skills page" },
      nav_squads: { title: "Go to Squads", desc: "Navigate to the squads page" },
      nav_armory: { title: "Go to Armory", desc: "Navigate to the armory page" },
      nav_tags: { title: "Go to Tags", desc: "Navigate to the tag hub" },
      nav_leaderboard: { title: "Go to Leaderboard", desc: "Navigate to the agent leaderboard" },
      nav_achievements: { title: "Go to Achievements", desc: "Navigate to your achievements" },
      nav_progress: { title: "Go to Progress", desc: "Navigate to the progress analysis page" },
      nav_guide: { title: "Go to Guide", desc: "Navigate to the system guidebook" },
      nav_settings: { title: "Go to Settings", desc: "Navigate to system settings" },
      toggle_sound: { title: "Toggle Sound", desc: "Enable or disable all sound effects" },
      change_theme: { title: "Change Theme", desc: "Cycle to the next visual theme" },
  },
  
  // Rewards
  rewards: {
    title: "Rewards Treasury",
    description: "Define your own rewards and redeem them with XP earned from completing operations. Your level is based on total XP and is not affected by spending.",
    spendable_xp: "Spendable XP",
    shop: "Shop",
    history: "History",
    add_reward_cta: "Add New Reward",
    no_rewards_placeholder: "No rewards defined. Add a custom reward to motivate yourself!",
    no_history_placeholder: "You haven't redeemed any rewards yet. Complete tasks, earn XP, and claim your prize!",
    add_new_reward: "Add New Reward",
    name_label: "Reward Name",
    name_placeholder: "e.g., Watch a movie",
    cost_label: "Cost (in XP)",
    icon_label: "Icon",
    icon_picker_title: "Select an Icon",
    one_time_label: "One-time purchase (cannot be redeemed again)",
    one_time: "One-Time",
    add_reward_button: "Add Reward",
    redeem: "Redeem",
    confirm_redeem_title: "Confirm Redemption",
    confirm_redeem_message: "Are you sure you want to redeem '{{name}}' for {{cost}} XP?",
  },
  
  // Tags
  tags: {
    title: "Tag Hub",
    description: "All tags used across your tasks, goals, and journal entries. Use this hub to quickly find related items.",
    search_placeholder: "Search tags...",
    no_tags_found: "No tags found.",
    items_tagged_with: "Items tagged with '{{tag}}'",
    add_or_create: "Add existing tags or create a new one...",
    add_or_create_skill: "Add tags to assign this task to skills...",
    add_to_entry: "Add tags to this entry...",
    add_to_entry_skill: "Add tags to associate this entry with skills...",
    count: "{{count}} items",
    no_items_found: "No items found with this tag.",
    tasks: "Tasks",
    goals: "Goals",
    journal_entries: "Journal Entries",
  },

  // Skills
  skills: {
    title: "Skill Matrix",
    description: "Track your progress in different areas. Skills are automatically leveled up by completing tasks with the corresponding tag.",
    add_new_skill: "Add New Skill",
    skill_name_placeholder: "Enter new skill name...",
    no_skills: "No skills tracked yet. Complete a task with a tag to start tracking a new skill!",
    level: "Level",
    consult_mentor: "Consult Mentor",
  },

  skill_mentor: {
    title: "Mentor for {{skill}}",
    welcome: "Greetings. I am your mentor for the **{{skill}}** skill. Ask me anything, or use the options below to get started.",
    placeholder: "Send a message to your mentor...",
    suggest_path: "Suggest Learning Path",
    find_resources: "Find Resources",
    system_prompt: "You are an expert mentor for the skill '{{skill}}'. You are encouraging, wise, and provide clear, actionable advice. Your responses should be concise and use simple markdown. Your goal is to help the user improve their skills.",
    path_prompt: "As an expert in {{skill}}, suggest a practical, step-by-step learning path for a beginner. Provide 3-5 key steps with a brief explanation for each. Frame it like a mini-quest.",
    resources_prompt: "As an expert in {{skill}}, find the best online resources for learning the topic. Summarize why they are useful.",
    resources_found: "I have scanned the network. Here are a few high-value resources I have found:",
    path_suggested: "This is a potential learning path I have mapped out for you:",
    sources: "Sources",
    search_error: "Network search failed. There may be a configuration issue or a temporary outage.",
  },

  // Squads
  squads: {
    title: "Squads",
    description: "Team up with other agents to complete weekly squad quests and earn massive rewards. Create your own squad or join with an invite code.",
    not_in_squad: "You are not currently in a squad.",
    create_squad: "Create Squad",
    squad_name: "Squad Name",
    squad_name_placeholder: "e.g., The Phantom Bytes",
    create_squad_cta: "Form Squad",
    join_squad: "Join Squad",
    invite_code: "Invite Code",
    invite_code_placeholder: "Enter 6-digit code...",
    join_squad_cta: "Join",
    my_squad: "My Squad",
    squad_vitals: "Squad Vitals",
    members: "Members",
    weekly_xp: "Weekly XP",
    weekly_squad_quest: "Weekly Squad Quest",
    quest_progress: "Quest Progress",
    quest_reward: "Squad Reward: {{xp}} XP each",
    squad_chat: "Squad Comms",
    chat_placeholder: "Send message... (simulated)",
    leave_squad: "Leave Squad",
    leave_squad_confirm_title: "Leave Squad",
    leave_squad_confirm_message: "Are you sure you want to leave this squad? Your progress on the current weekly quest will be lost.",
    quest_desc_xp: "Data Heist: Collect a total of {{target}} XP as a squad this week.",
    quest_desc_tasks: "Bug Hunt: Complete a total of {{target}} high-priority tasks as a squad this week.",
  },

  // Armory & Intel Caches
  armory: {
    title: "Armory",
    description: "Manage your Intel Caches and active Boosts. Caches may contain valuable resources to accelerate your progress.",
    caches_title: "Intel Caches",
    no_caches: "No intel caches found. Complete operations and daily directives to find them.",
    boosts_title: "Active Boosts",
    no_boosts: "No active boosts. Open Intel Caches to find them.",
    decrypt_button: "Decrypt",
    decrypting: "Decrypting...",
    loot_found: "Loot Found",
    loot_xp: "+{{amount}} XP",
    loot_boost_25: "+25% XP Boost (1 Hour)",
    loot_boost_50: "+50% XP Boost (1 Hour)",
    close_modal: "Close",
    common_cache: "Common Intel Cache",
    boost_active_for: "Active for",
  },
  
  // Quotes
  quotes,
  
  questlines: {
      web_dev: {
          name: "Code Weaver's Path",
          description: "Embark on a journey to build and deploy your first web application.",
          step1: "Project Initialization: Set up a new React project with Vite.",
          step2: "Component Forging: Create and style a reusable button component.",
          step3: "Data Infiltration: Fetch and display data from a public API.",
          step4: "State Manipulation: Implement a state management solution (Context or Reducer).",
          step5: "Final Deployment: Deploy the application to a free hosting service.",
      }
  },

  // Date formats
  date_formats: {
    // For toLocaleDateString()
    weekday_long: "long",
    year_numeric: "numeric",
    month_long: "long",
    day_numeric: "numeric",
    date_medium: "medium",
    time_short: "short",
    // For moment/jalali-moment format()
    month_year: "MMMM YYYY",
    full_date: "dddd, MMMM D, YYYY",
    day_of_month: "D",
  },
  
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekdays_short: ["S", "M", "T", "W", "T", "F", "S"],
};
