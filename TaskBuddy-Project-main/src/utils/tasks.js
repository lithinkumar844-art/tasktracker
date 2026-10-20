// Makes sure every task (old, imported or new) has all fields
export const normalizeTask = (t) => ({
  id: t.id ?? crypto.randomUUID(),
  text: String(t.text ?? ''),
  priority: t.priority ?? 'Medium',
  category: t.category ?? 'General',
  dueDate: t.dueDate ?? '',
  dueTime: t.dueTime ?? '',
  completed: Boolean(t.completed),
  completedAt: t.completedAt ?? null,
  subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
})
