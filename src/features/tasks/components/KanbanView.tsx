import { useState, type DragEvent } from 'react';
import { TASK_STATUSES, type Task, type TaskStatus } from '../../../models/task';
import { KanbanColumn } from './KanbanColumn';

interface KanbanViewProps {
  tasks: Task[];
  onOpen: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  onMoveTask: (taskId: string, targetStatus: TaskStatus) => void;
}

export function KanbanView({ tasks, onOpen, onDeleteRequest, onMoveTask }: KanbanViewProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);

  const handleDragStart = (event: DragEvent<HTMLElement>, taskId: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', taskId);
    setDraggingId(taskId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTarget(null);
  };

  const handleColumnDragOver = (event: DragEvent<HTMLElement>, status: TaskStatus) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTarget(status);
  };

  const handleDrop = (event: DragEvent<HTMLElement>, status: TaskStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    setDraggingId(null);
    setDropTarget(null);
    if (taskId) {
      onMoveTask(taskId, status);
    }
  };

  return (
    <div className="kanban">
      {TASK_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter((task) => task.status === status)}
          draggingId={draggingId}
          dropTarget={dropTarget}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onColumnDragOver={handleColumnDragOver}
          onDrop={handleDrop}
          onOpen={onOpen}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}