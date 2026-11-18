import type { Task, TaskStatus } from '../tasks';
import { TaskRow } from './TaskRow';

type TaskListProps = {
  tasks: Task[];
  employees: string[];
  employeeFilter: string;
  onFilterChange: (employee: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function TaskList({
  tasks,
  employees,
  employeeFilter,
  onFilterChange,
  onStatusChange,
}: TaskListProps) {
  const visibleTasks = tasks.filter(
    (task) => !employeeFilter || task.employee === employeeFilter
  );
  const today = new Date();

  return (
    <section className="panel" aria-labelledby="list-title">
      <div className="list-heading">
        <h2 id="list-title">Список задач</h2>
        <label>
          Фильтр по сотруднику
          <select
            value={employeeFilter}
            onChange={(event) => onFilterChange(event.target.value)}
          >
            <option value="">Все сотрудники</option>
            {employees.map((employee) => (
              <option key={employee}>{employee}</option>
            ))}
          </select>
        </label>
      </div>
      {visibleTasks.length === 0 ? (
        <p id="empty-state">
          {tasks.length
            ? 'По выбранному сотруднику задач нет.'
            : 'Задач пока нет. Добавьте первую задачу.'}
        </p>
      ) : (
        <div
          className="table-wrap"
          tabIndex={0}
          role="region"
          aria-labelledby="list-title"
        >
          <table className="task-table" role="table">
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader">
                  Задача
                </th>
                <th scope="col" role="columnheader">
                  Ответственный
                </th>
                <th scope="col" role="columnheader">
                  Срок выполнения
                </th>
                <th scope="col" role="columnheader">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {visibleTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  today={today}
                  onStatusChange={onStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
