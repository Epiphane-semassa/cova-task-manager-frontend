import type { DragEvent } from 'react';
import { Icon } from '../../../components/Icon';
import { IconButton } from '../../../components/IconButton';
import type { Task } from '../../../models/task';
import { formatDate } from '../../../lib/format';

interface KanbanCardProps {
  task: Task;
  dragging: boolean;
  onDragStart: (event: DragEvent<HTMLElement>, taskId: string) => void;
  onDragEnd: () => void;
  onOpen: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
}

export function KanbanCard({
  task,
  dragging,
  onDragStart,
  onDragEnd,
  onOpen,
  onDeleteRequest,
}: KanbanCardProps) {
  return (
    <div
      className={['kanban__card', dragging ? 'is-dragging' : ''].filter(Boolean).join(' ')}
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragEnd={onDragEnd}
    >
      <p
        className="kanban__card-title"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(task)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen(task);
          }
        }}
      >
        {task.title}
      </p>
      <div className="kanban__card-date">
        <Icon name="calendar" size={13} />
        Créée le {formatDate(task.createdAt)}
      </div>
      <div className="kanban__card-actions">
        <IconButton
          icon="trash"
          label="Supprimer la tâche"
          variant="danger"
          size="sm"
          onClick={() => onDeleteRequest(task)}
        />
      </div>
    </div>
  );
}