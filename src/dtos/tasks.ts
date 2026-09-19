import type { TaskStatus } from '../models/task';

export interface TaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface TaskListFilters {
  status?: TaskStatus | '';
  search?: string;
}