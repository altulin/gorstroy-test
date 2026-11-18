import { useState } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { loadTasks, saveTasks } from './tasks';
import type { Task, TaskStatus } from './tasks';
import './App.css';

function App() {
  const [initial] = useState(loadTasks);
  const [tasks, setTasks] = useState(initial.tasks);
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [notice, setNotice] = useState<{
    text: string;
    error?: boolean;
  } | null>(initial.error ? { text: initial.error, error: true } : null);

  const employees = [...new Set(tasks.map((task) => task.employee))].sort(
    (a, b) => a.localeCompare(b, 'ru')
  );

  function commit(next: Task[], success: string) {
    try {
      saveTasks(next);
    } catch {
      setNotice({
        text: 'Не удалось сохранить изменения в браузере.',
        error: true,
      });
      return false;
    }
    setTasks(next);
    setNotice({ text: success });
    return true;
  }

  function addTask({
    title,
    employee: employeeName,
    deadline,
  }: Pick<Task, 'title' | 'employee' | 'deadline'>) {
    const employee =
      employees.find(
        (name) =>
          name.toLocaleLowerCase('ru') === employeeName.toLocaleLowerCase('ru')
      ) ?? employeeName;

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      employee,
      deadline,
      status: 'new',
    };

    if (!commit([...tasks, task], 'Задача добавлена.')) return false;
    if (employeeFilter && employeeFilter !== employee) setEmployeeFilter('');
    return true;
  }

  function changeStatus(id: string, status: TaskStatus) {
    const next = tasks.map((task) =>
      task.id === id ? { ...task, status } : task
    );
    commit(next, 'Статус сохранён.');
  }

  return (
    <main>
      <header>
        <h1>Задачи сотрудников</h1>
      </header>

      <TaskForm
        employees={employees}
        disabled={Boolean(initial.error)}
        onAdd={addTask}
        onInvalid={() =>
          setNotice({
            text: 'Введите название задачи и имя ответственного.',
            error: true,
          })
        }
      />

      <p
        id="feedback"
        className={notice?.error ? 'error' : undefined}
        role="status"
      >
        {notice?.text}
      </p>

      <TaskList
        tasks={tasks}
        employees={employees}
        employeeFilter={employeeFilter}
        onFilterChange={setEmployeeFilter}
        onStatusChange={changeStatus}
      />
    </main>
  );
}

export default App;
