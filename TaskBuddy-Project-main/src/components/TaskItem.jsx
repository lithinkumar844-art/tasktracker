import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { breakIntoSubtasks } from '../api/ai'
import { toDateKey } from '../utils/dates'

export default function TaskItem({ task, updateTask, toggleTask, deleteTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isOverdue = task.dueDate && !task.completed && task.dueDate < toDateKey(new Date())

  const saveEdit = () => {
    const text = draft.trim()
    if (!text) return
    updateTask(task.id, { text })
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(task.text)
    setEditing(false)
  }

  const toggleSubtask = (subId) => {
    updateTask(task.id, {
      subtasks: task.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)),
    })
  }

  const removeSubtask = (subId) => {
    updateTask(task.id, { subtasks: task.subtasks.filter((s) => s.id !== subId) })
  }

  const handleBreakdown = async () => {
    setLoading(true)
    setError('')
    try {
      const steps = await breakIntoSubtasks(task.text)
      const newSubs = steps.map((text) => ({ id: crypto.randomUUID(), text, done: false }))
      updateTask(task.id, { subtasks: [...task.subtasks, ...newSubs] })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
    >
      <div className='task-main'>
        <button className='drag-handle' {...attributes} {...listeners} aria-label='Drag to reorder'>
          ⋮⋮
        </button>

        {editing ? (
          <input
            className='edit-input'
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
          />
        ) : (
          <div>
            <span>{task.text}</span>
            <small>({task.priority}, {task.category})</small>
            {task.dueDate && (
              <small className={`due ${isOverdue ? 'due-overdue' : ''}`}>
                Due {task.dueDate}{task.dueTime ? ` ${task.dueTime}` : ''}
                {isOverdue && ' · Overdue'}
              </small>
            )}
          </div>
        )}

        <div className='task-actions'>
          {editing ? (
            <>
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => toggleTask(task.id)}>
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </>
          )}
        </div>
      </div>

      <div className='task-extra'>
        {task.subtasks.length > 0 && (
          <ul className='subtasks'>
            {task.subtasks.map((s) => (
              <li key={s.id} className={s.done ? 'sub-done' : ''}>
                <label>
                  <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(s.id)} />
                  <span>{s.text}</span>
                </label>
                <button onClick={() => removeSubtask(s.id)} aria-label='Remove subtask'>✕</button>
              </li>
            ))}
          </ul>
        )}
        <button className='ai-btn' onClick={handleBreakdown} disabled={loading}>
          {loading ? 'Thinking…' : '✨ Break into subtasks'}
        </button>
        {error && <small className='error'>{error}</small>}
      </div>
    </li>
  )
}
