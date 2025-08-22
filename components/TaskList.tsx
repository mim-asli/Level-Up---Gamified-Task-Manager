

import React, { memo } from 'react';
import { Task } from '../types.js';
import TaskItem from './TaskItem.js';
import { useAppContext } from '../hooks/useAppContext.js';

interface TaskListProps {
  tasks: Task[];
  title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title }) => {
  const { t } = useAppContext();
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-bold text-[var(--text-secondary)] border-b-2 border-[var(--border-secondary)] pb-2">{title}</h2>}
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <TaskItem key={task.id} task={task} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-[var(--surface-primary)] border border-[var(--border-primary)]">
          <p className="text-[var(--text-muted)]">{t('task.no_tasks_placeholder')}</p>
        </div>
      )}
    </div>
  );
};

export default memo(TaskList);