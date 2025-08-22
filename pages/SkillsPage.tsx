import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import Icon from '../components/Icon.js';
import SkillCard from '../components/skills/SkillCard.js';
import { useSounds } from '../hooks/useSounds.js';

const SkillsPage: React.FC = () => {
    const { state, dispatch, t } = useAppContext();
    const play = useSounds();
    const [newSkillName, setNewSkillName] = useState('');

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkillName.trim()) {
            play('add');
            dispatch({ type: 'ADD_SKILL', payload: { name: newSkillName } });
            setNewSkillName('');
        }
    };

    const sortedSkills = [...state.skills].sort((a, b) => b.xp - a.xp);

    return (
        <div className="space-y-8">
            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
                <h1 className="text-3xl font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-3 group">
                    <Icon name="git-branch" className="w-8 h-8 icon-animated" />
                    {t('skills.title')}
                </h1>
                <p className="text-[var(--text-muted)] max-w-2xl">{t('skills.description')}</p>
            </div>

            <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-secondary)]">
                <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
                     <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder={t('skills.skill_name_placeholder')}
                        className="w-full bg-[var(--surface-tertiary)] p-3 text-[var(--text-secondary)] placeholder-[var(--text-placeholder)] focus:outline-none border border-[var(--border-secondary)] focus:border-[var(--border-accent)]"
                    />
                    <button
                        type="submit"
                        disabled={!newSkillName.trim()}
                        className="group flex-shrink-0 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--interactive-muted)] disabled:cursor-not-allowed text-[var(--accent-primary-text)] font-bold p-3 rounded-none transition-all duration-200 border border-[var(--border-accent)] hover:shadow-[0_0_15px_var(--shadow-accent)]"
                    >
                        <Icon name="plus" className="w-6 h-6"/>
                    </button>
                </form>

                 {sortedSkills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedSkills.map((skill, index) => (
                            <SkillCard key={skill.name} skill={skill} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-[var(--text-muted)]">{t('skills.no_skills')}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SkillsPage;