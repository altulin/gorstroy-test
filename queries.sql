-- PostgreSQL. Предполагается, что deadline имеет тип DATE, а status задан.
-- Статусы: new (Новая), in_progress (В работе), done (Завершена).
-- employees.id — первичный ключ, tasks.employee_id — внешний ключ на него.
-- Один сотрудник может отвечать за несколько задач или не иметь задач.

-- 1. Незавершённые задачи с именами ответственных.
SELECT t.id, t.title, e.name AS employee_name, t.deadline, t.status
FROM tasks AS t
JOIN employees AS e ON e.id = t.employee_id
WHERE t.status <> 'done'
ORDER BY t.deadline, t.id;

-- 2. Просроченные задачи. Срок на сегодня ещё не истёк.
SELECT t.id, t.title, e.name AS employee_name, t.deadline, t.status
FROM tasks AS t
JOIN employees AS e ON e.id = t.employee_id
WHERE t.status <> 'done'
  AND t.deadline < CURRENT_DATE
ORDER BY t.deadline, t.id;

-- 3. Незавершённые задачи по каждому сотруднику.
-- Условие в ON сохраняет сотрудников без открытых задач.
-- COUNT(t.id) считает совпавшие задачи и даёт 0, когда совпадений нет.
SELECT e.id, e.name, COUNT(t.id) AS unfinished_count
FROM employees AS e
LEFT JOIN tasks AS t
  ON t.employee_id = e.id
 AND t.status <> 'done'
GROUP BY e.id, e.name
ORDER BY e.name, e.id;
