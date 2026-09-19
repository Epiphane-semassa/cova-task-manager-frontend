import { useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { TaskStatus } from '../../../models/task';

export type TaskView = 'list' | 'kanban';

export function useTaskFilters() {
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput, 350);
  const [view, setView] = useLocalStorage<TaskView>('task_manager_view', 'list');

  return {
    status,
    setStatus,
    searchInput,
    setSearchInput,
    search,
    view,
    setView,
  };
}