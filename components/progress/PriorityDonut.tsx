import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext.js';
import { Task, TaskPriority } from '../../types.js';

interface PriorityDonutProps {
    tasks: Task[];
}

interface PriorityData {
    key: TaskPriority;
    name: string;
    count: number;
    percentage: number;
    color: string;
}

const PriorityDonut: React.FC<PriorityDonutProps> = ({ tasks }) => {
    const { t } = useAppContext();

    const priorityData = useMemo(() => {
        const completedTasks = tasks.filter(t => t.completed);
        const total = completedTasks.length;
        
        const counts = {
            high: completedTasks.filter(t => t.priority === 'high').length,
            medium: completedTasks.filter(t => t.priority === 'medium').length,
            low: completedTasks.filter(t => t.priority === 'low').length,
        };

        if (total === 0) return [];

        return [
            { key: 'high', name: t('priority.high'), count: counts.high, percentage: (counts.high / total) * 100, color: 'var(--text-danger)' },
            { key: 'medium', name: t('priority.medium'), count: counts.medium, percentage: (counts.medium / total) * 100, color: 'var(--border-accent)' },
            { key: 'low', name: t('priority.low'), count: counts.low, percentage: (counts.low / total) * 100, color: 'var(--text-muted)' },
        ].filter(d => d.count > 0);

    }, [tasks, t]);
    
    if (priorityData.length === 0) {
        return <div className="text-center text-[var(--text-muted)] py-10">{t('task.no_tasks_placeholder')}</div>;
    }

    const radius = 60;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
            <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                    r={radius}
                    cx="80"
                    cy="80"
                    fill="transparent"
                    stroke="var(--border-primary)"
                    strokeWidth={strokeWidth}
                />
                {priorityData.map((data) => {
                    const strokeDasharray = `${(data.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedPercentage / 100 * circumference;
                    accumulatedPercentage += data.percentage;

                    return (
                        <circle
                            key={data.key}
                            r={radius}
                            cx="80"
                            cy="80"
                            fill="transparent"
                            stroke={data.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 80 80)"
                        >
                             <title>{`${data.name}: ${data.count} (${data.percentage.toFixed(1)}%)`}</title>
                        </circle>
                    );
                })}
            </svg>
            <div className="space-y-2">
                {priorityData.map(data => (
                    <div key={data.key} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: data.color }} />
                        <div className="flex-grow text-[var(--text-primary)]">
                            <span className="font-semibold">{data.name}</span>
                            <span className="text-sm text-[var(--text-muted)] ms-2">({data.count})</span>
                        </div>
                        <div className="font-mono font-semibold text-[var(--text-secondary)]">
                            {data.percentage.toFixed(1)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriorityDonut;