import { formatDeadline, isOverdue, statuses } from '../tasks';
import type { Task, TaskStatus } from '../tasks';

type TaskRowProps = {
  task: Task;
  today: Date;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function TaskRow({ task, today, onStatusChange }: TaskRowProps) {
  const overdue = isOverdue(task, today);

  return (
    <tr role="row" className={overdue ? 'overdue' : undefined}>
      <td role="cell" className="task-title">
        {task.title}
      </td>
      <td role="cell">
        <span className="card-label" aria-hidden="true">
          Ответственный
        </span>
        {task.employee}
      </td>
      <td role="cell">
        <span className="card-label" aria-hidden="true">
          Срок выполнения
        </span>
        <time dateTime={task.deadline}>{formatDeadline(task.deadline)}</time>
        {overdue && <span className="overdue-label">Просрочена</span>}
      </td>
      <td role="cell" className="task-status">
        <span className="card-label" aria-hidden="true">
          Статус
        </span>
        <select
          aria-label={'Статус задачи «' + task.title + '»'}
          value={task.status}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value as TaskStatus)
          }
        >
          {Object.entries(statuses).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
