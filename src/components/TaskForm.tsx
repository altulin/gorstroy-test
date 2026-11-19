import type { SubmitEvent } from 'react';
import type { Task } from '../tasks';

type TaskFormProps = {
  employees: string[];
  disabled: boolean;
  onAdd: (task: Pick<Task, 'title' | 'employee' | 'deadline'>) => boolean;
  onInvalid: () => void;
};

export function TaskForm({
  employees,
  disabled,
  onAdd,
  onInvalid,
}: TaskFormProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get('title')).trim();
    const employee = String(data.get('employee')).trim().replace(/\s+/g, ' ');
    const deadline = String(data.get('deadline'));

    if (!title || !employee) {
      onInvalid();
      form
        .querySelector<HTMLInputElement>(
          !title ? '[name="title"]' : '[name="employee"]'
        )
        ?.focus();
      return;
    }

    if (onAdd({ title, employee, deadline })) {
      form.reset();
      form.querySelector<HTMLInputElement>('[name="title"]')?.focus();
    }
  }

  return (
    <section className="panel" aria-labelledby="form-title">
      <h2 id="form-title">Новая задача</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Название задачи
          <input
            name="title"
            placeholder="Например, проверить акт"
            maxLength={160}
            required
          />
        </label>
        <label>
          Ответственный
          <input
            name="employee"
            list="employees"
            placeholder="Имя сотрудника"
            maxLength={80}
            required
            autoComplete="off"
          />
        </label>
        <datalist id="employees">
          {employees.map((employee) => (
            <option key={employee} value={employee} />
          ))}
        </datalist>
        <label>
          Срок выполнения
          <input name="deadline" type="date" max="9999-12-31" required />
        </label>
        <button type="submit" disabled={disabled}>
          Добавить задачу
        </button>
      </form>
    </section>
  );
}
