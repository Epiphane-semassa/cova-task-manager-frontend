export const TASK_STATUSES = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'BLOCKED',
  'ON_HOLD',
  'DONE',
  'CANCELLED',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog',
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  IN_REVIEW: 'En revue',
  BLOCKED: 'Bloqué',
  ON_HOLD: 'En attente',
  DONE: 'Terminé',
  CANCELLED: 'Annulé',
};

export const TASK_STATUS_TONES: Record<TaskStatus, string> = {
  BACKLOG: 'neutral',
  TODO: 'info',
  IN_PROGRESS: 'warning',
  IN_REVIEW: 'primary',
  BLOCKED: 'danger',
  ON_HOLD: 'default',
  DONE: 'success',
  CANCELLED: 'neutral',
};

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}