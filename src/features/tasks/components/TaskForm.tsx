import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { Textarea } from '../../../components/Textarea';
import type { TaskPayload } from '../../../dtos/tasks';
import { TASK_STATUSES, TASK_STATUS_LABELS, type Task, type TaskStatus } from '../../../models/task';

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Le titre est obligatoire')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  description: z.string().trim().min(1, 'La description est obligatoire'),
  status: z.enum(TASK_STATUSES),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task: Task | null;
  onSubmit: (payload: TaskPayload) => void;
}

function toDefaultValues(task: Task | null): TaskFormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'TODO',
  };
}

export function TaskForm({ task, onSubmit }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: toDefaultValues(task),
  });

  const submit = (values: TaskFormValues) => {
    onSubmit({
      title: values.title,
      description: values.description,
      status: values.status as TaskStatus,
    });
  };

  return (
    <form id="task-form" className="task-drawer-form" onSubmit={handleSubmit(submit)} noValidate>
      <Input
        label="Titre"
        type="text"
        placeholder="Titre de la tâche"
        autoFocus
        error={errors.title?.message}
        {...register('title')}
      />
      <Textarea
        label="Description"
        placeholder="Décrivez la tâche à réaliser"
        error={errors.description?.message}
        {...register('description')}
      />
      <Select label="Statut" error={errors.status?.message} {...register('status')}>
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {TASK_STATUS_LABELS[status]}
          </option>
        ))}
      </Select>
    </form>
  );
}