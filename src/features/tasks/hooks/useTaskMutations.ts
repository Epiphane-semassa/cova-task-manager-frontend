import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { apiCreateTask, apiDeleteTask, apiUpdateTask } from '../../../api/endpoints';
import type { TaskPayload } from '../../../dtos/tasks';
import type { Task } from '../../../models/task';

interface UpdateTaskInput {
  id: string;
  payload: TaskPayload;
}

interface TaskMutationContext {
  previous: Array<readonly [QueryKey, Task[] | undefined]>;
}

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const invalidateTasks = () => void queryClient.invalidateQueries({ queryKey: ['tasks'] });

  const restoreSnapshot = (context: TaskMutationContext | undefined) => {
    if (!context) {
      return;
    }
    for (const [key, data] of context.previous) {
      queryClient.setQueryData(key, data);
    }
  };

  const createTask = useMutation({
    mutationFn: (payload: TaskPayload) => apiCreateTask(payload),
    onSuccess: invalidateTasks,
  });

  const updateTask = useMutation({
    mutationFn: ({ id, payload }: UpdateTaskInput) => apiUpdateTask(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });
      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...payload } : task)),
      );
      return { previous } satisfies TaskMutationContext;
    },
    onError: (_error, _variables, context) => restoreSnapshot(context),
    onSettled: invalidateTasks,
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => apiDeleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks'] });
      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, (old) =>
        old?.filter((task) => task.id !== id),
      );
      return { previous } satisfies TaskMutationContext;
    },
    onError: (_error, _id, context) => restoreSnapshot(context),
    onSettled: invalidateTasks,
  });

  return { createTask, updateTask, deleteTask };
}