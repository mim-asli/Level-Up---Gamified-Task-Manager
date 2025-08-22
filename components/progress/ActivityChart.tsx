import React, { useMemo } from 'react';
import moment, { type Moment } from 'moment';
import jmoment from 'jalali-moment';
import { useAppContext } from '../../hooks/useAppContext.js';
import { Task } from '../../types.js';

interface ActivityChartProps {
    tasks: Task[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ tasks }) => {
    const { t, language } = useAppContext();

    const chartData = useMemo(() => {
        const getMoment = (date?: moment.MomentInput): Moment => {
            const input = moment.isMoment(date) ? (date as moment.Moment).toDate() : date;
            const m = language === 'fa' ? jmoment(input) : moment(input);
            return m.locale(language) as any;
        };
        const data: { label: string, value: number }[] = [];
        
        for (let i = 6; i >= 0; i--) {
            const day = getMoment(new Date()).subtract(i, 'days');
            const dayKey = day.clone().locale('en').format('YYYY-MM-DD');
            
            const xpForDay = tasks
                .filter(task => task.completed && task.createdAt.startsWith(dayKey))
                .reduce((sum, task) => sum + task.xp, 0);

            data.push({
                label: day.format('ddd'),
                value: xpForDay,
            });
        }
        return data;
    }, [tasks, language, t]);

    const maxValue = Math.max(...chartData.map(d => d.value), 20); // Min height of 20xp for visual
    const barWidth = 40;
    const barMargin = 15;
    const chartWidth = chartData.length * (barWidth + barMargin);
    const chartHeight = 200;

    return (
        <div className="w-full overflow-x-auto p-4">
            <svg width={chartWidth} height={chartHeight} aria-label={t('progress.xp_last_7_days')}>
                {chartData.map((data, index) => {
                    const barHeight = (data.value / maxValue) * (chartHeight - 30); // 30px for labels
                    const x = index * (barWidth + barMargin) + barMargin / 2;
                    const y = chartHeight - barHeight - 20; // 20px for bottom label
                    
                    return (
                        <g key={index}>
                             <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill="var(--accent-primary)"
                                rx="2"
                                ry="2"
                                opacity="0.6"
                            >
                                <title>{`${data.label}: ${data.value} ${t('xp')}`}</title>
                            </rect>
                             <text
                                x={x + barWidth / 2}
                                y={y - 8}
                                textAnchor="middle"
                                fontSize="12"
                                fontWeight="bold"
                                fill="var(--text-secondary)"
                                className="font-mono"
                            >
                                {data.value}
                            </text>
                             <text
                                x={x + barWidth / 2}
                                y={chartHeight - 5}
                                textAnchor="middle"
                                fontSize="12"
                                fill="var(--text-muted)"
                            >
                                {data.label}
                            </text>
                        </g>
                    );
                })}
                 <line
                    x1="0"
                    y1={chartHeight - 18}
                    x2={chartWidth}
                    y2={chartHeight - 18}
                    stroke="var(--border-primary)"
                    strokeWidth="2"
                 />
            </svg>
        </div>
    );
};

export default ActivityChart;