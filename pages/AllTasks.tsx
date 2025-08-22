


import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext.js';
import TaskList from '../components/TaskList.js';
import Icon from '../components/Icon.js';

const AllTasks: React.FC = () => {
  const { state, t } = useAppContext();
  
  // Show newest tasks first
  const sortedTasks = useMemo(() =>
    [...state.tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [state.tasks]
  );

  return (
    <div className="bg-[var(--surface-primary)] p-6 rounded-none border border-[var(--border-faded)]">
       <div className="flex items-center gap-3 mb-6 group">
        <Icon name="tasks" className="w-8 h-8 text-[var(--text-primary)] icon-animated"/>
        <h1 className="text-3xl font-bold text-[var(--text-secondary)]">{t('archive.title')}</h1>
      </div>
      <TaskList tasks={sortedTasks} title={t('archive.subtitle')} />
    </div>
  );
};

export default AllTasks;