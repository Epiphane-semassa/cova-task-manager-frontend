import { IconButton } from '../../../components/IconButton';
import { StatusBadge } from '../../../components/StatusBadge';
import type { Task } from '../../../models/task';
import { formatDate } from '../../../lib/format';

interface TaskListViewProps {
  tasks: Task[];
  onTaskOpen: (task: Task) => void;
  onEditRequest: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
}

export function TaskListView({ tasks, onTaskOpen, onEditRequest, onDeleteRequest }: TaskListViewProps) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article key={task.id} className="task-list__item">
          <div
            className="task-list__content"
            role="button"
            tabIndex={0}
            onClick={() => onTaskOpen(task)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onTaskOpen(task);
              }
            }}
          >
            <p className="task-list__title">{task.title}</p>
            <p className="task-list__description">{task.description}</p>
            <div className="task-list__meta">
              <StatusBadge status={task.status} />
              <span>Créée le {formatDate(task.createdAt)}</span>
              <span>Modifiée le {formatDate(task.updatedAt)}</span>
            </div>
          </div>
          <div className="task-list__actions">
            <IconButton icon="pencil" label="Modifier la tâche" onClick={() => onEditRequest(task)} />
            <IconButton
              icon="trash"
              label="Supprimer la tâche"
              variant="danger"
              onClick={() => onDeleteRequest(task)}
            />
          </div>
        </article>
      ))}
    </div>
  );
}