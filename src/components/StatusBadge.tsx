import { TASK_STATUS_LABELS, TASK_STATUS_TONES, type TaskStatus } from '../models/task';
import { Badge } from './Badge';

export function StatusBadge({ status, dot = true }: { status: TaskStatus; dot?: boolean }) {
  return (
    <Badge tone={(TASK_STATUS_TONES[status] ?? 'default') as 'default'} dot={dot}>
      {TASK_STATUS_LABELS[status]}
    </Badge>
  );
}