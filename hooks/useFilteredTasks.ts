
import { useMemo } from 'react';
import { useAppContext } from './useAppContext.js';
import { Task } from '../types.js';
import { isISODateToday } from '../lib/utils.js';

export const useFilteredTasks = () => {
    const { state } = useAppContext();
    const { tasks } = state;
    const todayString = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const isTaskForToday = (task: Task) => {
        if (task.dueDate) {
            return task.dueDate === todayString;
        }
        return isISODateToday(task.createdAt);
    };

    const todayTasks = useMemo(() => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return state.tasks
            .filter(task => !task.completed && isTaskForToday(task))
            .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }, [state.tasks, todayString]);
    
    const completedTodayTasks = useMemo(() => {
        return state.tasks.filter(task => task.completed && task.createdAt.startsWith(todayString));
    }, [state.tasks, todayString]);
    
    return { todayTasks, completedTodayTasks };
};
