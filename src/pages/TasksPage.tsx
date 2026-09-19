import { useState } from 'react';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Icon } from '../components/Icon';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Spinner } from '../components/Spinner';
import { Toggle } from '../components/Toggle';
import { useToast } from '../components/toast-context';
import type { TaskPayload } from '../dtos/tasks';
import { extractApiErrorMessage } from '../lib/api-error';
import { TASK_STATUSES, TASK_STATUS_LABELS, type Task, type TaskStatus } from '../models/task';
import { AppLayout } from '../features/layout/AppLayout';
import { KanbanView } from '../features/tasks/components/KanbanView';
import { TaskDrawer } from '../features/tasks/components/TaskDrawer';
import { TaskListView } from '../features/tasks/components/TaskListView';
import { TaskListSkeleton } from '../features/tasks/components/TaskListSkeleton';
import { useTaskFilters } from '../features/tasks/hooks/useTaskFilters';
import { useTaskMutations } from '../features/tasks/hooks/useTaskMutations';
import { useTasks } from '../features/tasks/hooks/useTasks';

export function TasksPage() {
  const filters = useTaskFilters();
  const { toast } = useToast();
  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useTasks({ status: filters.status, search: filters.search });

  const { createTask, updateTask, deleteTask } = useTaskMutations();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => {
    setEditingTask(null);
    setDrawerOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleSubmit = (payload: TaskPayload) => {
    setSubmitting(true);
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, payload },
        {
          onSuccess: () => {
            toast.success('Tâche modifiée avec succès.');
            setDrawerOpen(false);
          },
          onError: (error) => toast.error(extractApiErrorMessage(error, 'Impossible de modifier la tâche.')),
          onSettled: () => setSubmitting(false),
        },
      );
      return;
    }
    createTask.mutate(payload, {
      onSuccess: () => {
        toast.success('Tâche créée avec succès.');
        setDrawerOpen(false);
      },
      onError: (error) => toast.error(extractApiErrorMessage(error, 'Impossible de créer la tâche.')),
      onSettled: () => setSubmitting(false),
    });
  };

  const handleDeleteRequest = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleDeleteConfirm = () => {
    if (!taskToDelete) {
      return;
    }
    setSubmitting(true);
    deleteTask.mutate(taskToDelete.id, {
      onSuccess: () => {
        toast.success('Tâche supprimée avec succès.');
        setTaskToDelete(null);
      },
      onError: (error) => toast.error(extractApiErrorMessage(error, 'Impossible de supprimer la tâche.')),
      onSettled: () => setSubmitting(false),
    });
  };

  const handleMoveTask = (taskId: string, targetStatus: TaskStatus) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.status === targetStatus) {
      return;
    }
    updateTask.mutate(
      { id: taskId, payload: { title: task.title, description: task.description, status: targetStatus } },
      {
        onError: (error) =>
          toast.error(extractApiErrorMessage(error, 'Impossible de déplacer la tâche.')),
      },
    );
  };

  const hasTasks = tasks.length > 0;
  const isFiltering = filters.status !== '' || filters.searchInput.trim() !== '';

  return (
    <AppLayout>
      <div className="page-title">Mes tâches</div>
      <p className="page-subtitle">Organisez, filtrez et suivez votre travail en temps réel.</p>

      <div className="toolbar">
        <div className="toolbar__left">
          <div className="toolbar__search">
            <Icon name="search" />
            <Input
              type="search"
              placeholder="Rechercher une tâche..."
              value={filters.searchInput}
              onChange={(event) => filters.setSearchInput(event.target.value)}
              aria-label="Rechercher une tâche"
            />
          </div>
          <Select
            aria-label="Filtrer par statut"
            value={filters.status}
            onChange={(event) => filters.setStatus(event.target.value as TaskStatus | '')}
          >
            <option value="">Tous les statuts</option>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </div>
        <div className="toolbar__right">
          <Toggle
            ariaLabel="Changer la vue des tâches"
            options={[
              { value: 'list', label: 'Liste', icon: 'list' },
              { value: 'kanban', label: 'Kanban', icon: 'kanban' },
            ]}
            value={filters.view}
            onChange={(value) => filters.setView(value as 'list' | 'kanban')}
          />
          <Button onClick={openCreate}>
            <Icon name="plus" size={16} />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {isError && (
        <EmptyState
          icon="alert"
          title="Impossible de charger les tâches"
          description="Une erreur est survenue lors de la récupération des tâches."
          action={<Button variant="secondary" onClick={() => void refetch()}>Réessayer</Button>}
        />
      )}

      {!isError && isLoading && filters.view === 'list' && <TaskListSkeleton />}

      {!isError && isLoading && filters.view === 'kanban' && <Spinner center label="Chargement des tâches" />}

      {!isError && !isLoading && !hasTasks && (
        <EmptyState
          icon="empty"
          title="Aucune tâche"
          description={
            isFiltering
              ? 'Aucune tâche ne correspond à vos filtres actuels.'
              : 'Créez votre première tâche pour commencer.'
          }
          action={isFiltering ? undefined : <Button onClick={openCreate}>Créer une tâche</Button>}
        />
      )}

      {!isError && !isLoading && hasTasks && filters.view === 'list' && (
        <TaskListView
          tasks={tasks}
          onTaskOpen={openEdit}
          onEditRequest={openEdit}
          onDeleteRequest={handleDeleteRequest}
        />
      )}

      {!isError && !isLoading && hasTasks && filters.view === 'kanban' && (
        <KanbanView
          tasks={tasks}
          onOpen={openEdit}
          onDeleteRequest={handleDeleteRequest}
          onMoveTask={handleMoveTask}
        />
      )}

      <TaskDrawer
        open={drawerOpen}
        task={editingTask}
        submitting={submitting}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Supprimer la tâche"
        message={taskToDelete ? `Voulez-vous vraiment supprimer « ${taskToDelete.title} » ? Cette action est irréversible.` : ''}
        confirmLabel="Supprimer"
        danger
        loading={submitting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setTaskToDelete(null)}
      />
    </AppLayout>
  );
}