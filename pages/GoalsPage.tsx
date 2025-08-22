import React, { useState } from 'react';
import moment from 'moment';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import GoalItem from '../components/GoalItem.js';
import GoalOracleModal from '../components/GoalOracleModal.js';
import { useSounds } from '../hooks/useSounds.js';
import AddGoalForm from '../components/AddGoalForm.js';
import QuestlineCatalogItem, { PredefinedQuestline } from '../components/questline/QuestlineCatalogItem.js';


const GoalsPage: React.FC = () => {
    const { state, t, dispatch } = useAppContext();
    const [isOracleOpen, setIsOracleOpen] = useState(false);
    const [isManualFormOpen, setIsManualFormOpen] = useState(false);
    const play = useSounds();
    
    const PREDEFINED_QUESTLINES: PredefinedQuestline[] = [
      {
        id: 'QL_CODE_WEAVER_1',
        nameKey: 'questlines.web_dev.name',
        descriptionKey: 'questlines.web_dev.description',
        icon: 'terminal',
        deadlineMonths: 3,
        steps: [
          { textKey: 'questlines.web_dev.step1', xp: 20 },
          { textKey: 'questlines.web_dev.step2', xp: 30 },
          { textKey: 'questlines.web_dev.step3', xp: 50 },
          { textKey: 'questlines.web_dev.step4', xp: 70 },
          { textKey: 'questlines.web_dev.step5', xp: 100 },
        ]
      },
    ];

    const handleOpenOracle = () => {
        play('click');
        setIsOracleOpen(true);
    };

    const handleAddQuestline = (questline: PredefinedQuestline) => {
        play('add');
        const deadline = moment().add(questline.deadlineMonths, 'months').format('YYYY-MM-DD');
        dispatch({
            type: 'ADD_GOAL',
            payload: {
                name: t(questline.nameKey),
                deadline,
                questline: {
                    steps: questline.steps.map(s => ({ text: t(s.textKey), xp: s.xp }))
                }
            }
        });
    };
    
    const activeQuestlineIds = state.goals
        .filter(g => g.isQuestline)
        .map(g => g.name); // Using name as a pseudo-ID for predefined quests

    return (
        <>
            <div className="space-y-8">
                <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                    <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-4 flex items-center gap-3 group">
                        <Icon name="goal" className="w-8 h-8 icon-animated" />
                        {t('goals.title')}
                    </h1>
                    <p className="text-[var(--text-muted)] mb-6 max-w-2xl">
                        {t('goals.description')}
                    </p>
                    {isManualFormOpen ? (
                        <AddGoalForm onCancel={() => setIsManualFormOpen(false)} />
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={handleOpenOracle}
                                className="group w-full flex items-center justify-center gap-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--accent-primary-text)] font-bold py-3 px-5 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)] text-lg"
                            >
                                <Icon name="sparkle" className="w-6 h-6 icon-animated" />
                                <span>{t('goals.initiate_objective_protocol')}</span>
                            </button>
                            <div className="flex items-center gap-4">
                                <hr className="flex-grow border-[var(--border-primary)]" />
                                <span className="text-[var(--text-muted)] font-semibold">{t('goals.or_divider')}</span>
                                <hr className="flex-grow border-[var(--border-primary)]" />
                            </div>
                            <button
                                onClick={() => {
                                    play('click');
                                    setIsManualFormOpen(true);
                                }}
                                className="group w-full flex items-center justify-center gap-3 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-[var(--accent-secondary-text)] font-bold py-3 px-5 rounded-none transition-all duration-200 border border-[var(--border-secondary)] hover:border-[var(--border-accent)] text-lg"
                            >
                                <Icon name="plus" className="w-6 h-6 icon-animated" />
                                <span>{t('goals.manual_add_cta')}</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)] flex items-center gap-3">
                        <Icon name="terminal" className="w-7 h-7" />
                        {t('goals.available_questlines')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PREDEFINED_QUESTLINES.map(ql => (
                           <QuestlineCatalogItem 
                                key={ql.id}
                                questline={ql}
                                onAdd={() => handleAddQuestline(ql)}
                                isAdded={activeQuestlineIds.includes(t(ql.nameKey))}
                           />
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)]">{t('goals.active_objectives')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {state.goals.filter(g => g.isActive).map((goal, index) => (
                            <GoalItem key={goal.id} goal={goal} index={index} />
                        ))}
                    </div>
                     {state.goals.filter(g => g.isActive).length === 0 && (
                         <div className="text-center py-10 px-4 bg-[var(--surface-primary)] rounded-none border border-[var(--border-primary)]">
                            <p className="text-[var(--text-muted)]">{t('goals.no_active_objectives')}</p>
                         </div>
                     )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)]">{t('goals.paused_objectives')}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {state.goals.filter(g => !g.isActive).map((goal, index) => (
                            <GoalItem key={goal.id} goal={goal} index={index} />
                        ))}
                    </div>
                     {state.goals.filter(g => !g.isActive).length === 0 && (
                         <div className="text-center py-10 px-4 bg-[var(--surface-primary)] rounded-none border border-[var(--border-primary)]">
                            <p className="text-[var(--text-muted)]">{t('goals.no_paused_objectives')}</p>
                         </div>
                     )}
                </div>
            </div>
            <GoalOracleModal isOpen={isOracleOpen} onClose={() => setIsOracleOpen(false)} />
        </>
    );
};

export default GoalsPage;