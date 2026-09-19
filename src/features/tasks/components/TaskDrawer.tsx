import { Button } from '../../../components/Button';
import { Drawer } from '../../../components/Drawer';
import type { TaskPayload } from '../../../dtos/tasks';
import type { Task } from '../../../models/task';
import { TaskForm } from './TaskForm';

interface TaskDrawerProps {
  open: boolean;
  task: Task | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: TaskPayload) => void;
}

export function TaskDrawer({ open, task, submitting, onClose, onSubmit }: TaskDrawerProps) {
  return (
    <Drawer
      open={open}
      title={task ? 'Modifier la tâche' : 'Nouvelle tâche'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button type="submit" form="task-form" loading={submitting}>
            {task ? 'Enregistrer' : 'Créer la tâche'}
          </Button>
        </>
      }
    >
      <TaskForm key={task?.id ?? 'new'} task={task} onSubmit={onSubmit} />
    </Drawer>
  );
}