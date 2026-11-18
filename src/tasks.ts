const storageKey = 'gorstroy-test.employeeTasks';
const dateFormat = new Intl.DateTimeFormat('ru-RU', { timeZone: 'UTC' });

export const statuses = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Завершена',
} as const;

export type TaskStatus = keyof typeof statuses;

export type Task = {
  id: string;
  title: string;
  employee: string;
  deadline: string;
  status: TaskStatus;
};

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const task = value as Partial<Task>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.employee === 'string' &&
    typeof task.deadline === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(task.deadline) &&
    !Number.isNaN(Date.parse(task.deadline)) &&
    typeof task.status === 'string' &&
    Object.hasOwn(statuses, task.status)
  );
}

export function loadTasks(): { tasks: Task[]; error?: string } {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) return { tasks: [] };
    const tasks: unknown = JSON.parse(saved);
    if (Array.isArray(tasks) && tasks.every(isTask)) return { tasks };
  } catch {
    // Если хранилище недоступно, возвращаем ту же ошибку, что и для нечитаемых данных.
  }
  return { tasks: [], error: 'Не удалось загрузить сохранённые задачи.' };
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

export function formatDeadline(deadline: string) {
  return dateFormat.format(new Date(deadline));
}

export function isOverdue(task: Task, today: Date) {
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayKey = `${today.getFullYear()}-${month}-${day}`;
  return task.status !== 'done' && task.deadline < todayKey;
}
