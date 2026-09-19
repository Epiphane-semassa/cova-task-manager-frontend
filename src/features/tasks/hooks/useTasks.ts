import { useQuery } from '@tanstack/react-query';
import { apiGetTasks } from '../../../api/endpoints';
import type { TaskListFilters } from '../../../dtos/tasks';

export function useTasks(filters: TaskListFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => apiGetTasks(filters),
    gcTime: 0,
    placeholderData: (previous) => previous,
  });
}