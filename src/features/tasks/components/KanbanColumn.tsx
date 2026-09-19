import type { DragEvent } from 'react';
import { StatusBadge } from '../../../components/StatusBadge';
import { TASK_STATUS_LABELS, type Task, type TaskStatus } from '../../../models/task';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  draggingId: string | null;
  dropTarget: TaskStatus | null;
  onDragStart: (event: DragEvent<HTMLElement>, taskId: string) => void;
  onDragEnd: () => void;
  onDrop: (event: DragEvent<HTMLElement>, status: TaskStatus) => void;
  onColumnDragOver: (event: DragEvent<HTMLElement>, status: TaskStatus) => void;
  onOpen: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
}

export function KanbanColumn({
  status,
  tasks,
  draggingId,
  dropTarget,
  onDragStart,
  onDragEnd,
  onDrop,
  onColumnDragOver,
  onOpen,
  onDeleteRequest,
}: KanbanColumnProps) {
  return (
    <section
      className={['kanban__column', dropTarget === status ? 'is-drop-target' : '']
        .filter(Boolean)
        .join(' ')}
      onDragOver={(event) => onColumnDragOver(event, status)}
      onDrop={(event) => onDrop(event, status)}
    >
      <header className="kanban__column-header">
        <StatusBadge status={status} dot={false} />
        <span className="kanban__column-count">{tasks.length}</span>
      </header>
      <div className="kanban__column-body">
        {tasks.length === 0 && <div className="kanban__column-empty">{TASK_STATUS_LABELS[status]} — aucune tâche</div>}
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            dragging={draggingId === task.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onOpen={onOpen}
            onDeleteRequest={onDeleteRequest}
          />
        ))}
      </div>
    </section>
  );
}