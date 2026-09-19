import type { TaskListFilters, TaskPayload } from '../../dtos/tasks';
import type { Task } from '../../models/task';
import type { ApiEnvelope } from '../../types/envelope';
import { create, delete_, getById, list, update } from '../sdk.gen';

type EnvelopeWithData<T> = ApiEnvelope<T>;

export async function apiGetTasks(filters?: TaskListFilters): Promise<Task[]> {
  const { data } = await list({
    query: {
      status: filters?.status || undefined,
      search: filters?.search || undefined,
    },
    throwOnError: true,
  });
  const envelope = data as unknown as EnvelopeWithData<Task[]>;
  return envelope.data ?? [];
}

export async function apiGetTaskById(id: string): Promise<Task> {
  const { data } = await getById({
    path: { id },
    throwOnError: true,
  });
  const envelope = data as unknown as EnvelopeWithData<Task>;
  return envelope.data;
}

export async function apiCreateTask(payload: TaskPayload): Promise<Task> {
  const { data } = await create({
    body: payload,
    throwOnError: true,
  });
  const envelope = data as unknown as EnvelopeWithData<Task>;
  return envelope.data;
}

export async function apiUpdateTask(id: string, payload: TaskPayload): Promise<Task> {
  const { data } = await update({
    path: { id },
    body: payload,
    throwOnError: true,
  });
  const envelope = data as unknown as EnvelopeWithData<Task>;
  return envelope.data;
}

export async function apiDeleteTask(id: string): Promise<void> {
  await delete_({
    path: { id },
    throwOnError: true,
  });
}