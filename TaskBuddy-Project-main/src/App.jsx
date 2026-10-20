import React, { useEffect, useMemo, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import ProgressTracker from './components/ProgressTracker'
import FilterBar from './components/FilterBar'
import Analytics from './components/Analytics'
import Streak from './components/Streak'
import Badges from './components/Badges'
import { normalizeTask } from './utils/tasks'
import { computeStreak, dayKey, toDateKey } from './utils/dates'
import './Style.css'

const readJSON = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

const loadTasks = () => {
  const saved = readJSON('tasks', [])
  return Array.isArray(saved) ? saved.map(normalizeTask) : []
}

const loadActivity = () => {
  const saved = readJSON('activity', [])
  return Array.isArray(saved) ? saved : []
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [activity, setActivity] = useState(loadActivity) // days with a completed task
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    category: 'All',
  })

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('activity', JSON.stringify(activity))
  }, [activity])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  const addTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID() }])
  }

  const updateTask = (id, changes) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    if (!task.completed) {
      updateTask(id, { completed: true, completedAt: new Date().toISOString() })
      const today = toDateKey(new Date())
      setActivity((prev) => (prev.includes(today) ? prev : [...prev, today]))
    } else {
      updateTask(id, { completed: false, completedAt: null })
      // Undo: drop that day from the streak if nothing else was completed on it
      const day = task.completedAt && dayKey(task.completedAt)
      const stillActive = tasks.some(
        (t) => t.id !== id && t.completedAt && dayKey(t.completedAt) === day
      )
      if (day && !stillActive) setActivity((prev) => prev.filter((d) => d !== day))
    }
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const clearTasks = () => setTasks([])

  // Filters and search
  const matches = (t) =>
    (filters.status === 'All' || (filters.status === 'Completed') === t.completed) &&
    (filters.priority === 'All' || t.priority === filters.priority) &&
    (filters.category === 'All' || t.category === filters.category) &&
    t.text.toLowerCase().includes(filters.search.trim().toLowerCase())

  const visibleTasks = tasks.filter(matches)

  // Drag and drop: reorder the visible tasks, keep hidden ones in place
  const reorderTasks = (activeId, overId) => {
    setTasks((prev) => {
      const visible = prev.filter(matches)
      const from = visible.findIndex((t) => t.id === activeId)
      const to = visible.findIndex((t) => t.id === overId)
      if (from < 0 || to < 0) return prev
      const reordered = arrayMove(visible, from, to)
      let i = 0
      return prev.map((t) => (matches(t) ? reordered[i++] : t))
    })
  }

  // Export / import
  const exportTasks = () => {
    const blob = new Blob([JSON.stringify({ tasks, activity }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'taskbuddy-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTasks = (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        const list = Array.isArray(data) ? data : data.tasks
        if (!Array.isArray(list)) throw new Error('bad file')
        if (!window.confirm(`Replace your current tasks with ${list.length} imported tasks?`)) return
        setTasks(list.map(normalizeTask))
        if (Array.isArray(data.activity)) setActivity(data.activity)
      } catch {
        alert('That file is not a valid TaskBuddy backup.')
      }
    }
    reader.readAsText(file)
  }

  const streak = useMemo(() => computeStreak(activity), [activity])
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className='App'>
      <header>
        <h1 className='title'>TaskBuddy</h1>
        <p className='tagline'>Your friendly Task Manager</p>
        <div className='header-actions'>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={exportTasks}>Export</button>
          <label className='import-btn'>
            Import
            <input type="file" accept="application/json,.json" onChange={importTasks} hidden />
          </label>
        </div>
      </header>

      <Streak streak={streak} />
      <Badges completed={completedCount} bestStreak={streak.best} />

      <TaskForm addTask={addTask} />
      <FilterBar filters={filters} setFilters={setFilters} />
      <TaskList
        tasks={visibleTasks}
        updateTask={updateTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        reorderTasks={reorderTasks}
      />
      {tasks.length > 0 && visibleTasks.length === 0 && (
        <p className='empty'>No tasks match your filters.</p>
      )}
      <ProgressTracker tasks={tasks} />

      <Analytics tasks={tasks} />

      {tasks.length > 0 && (
        <button className='clear-btn' onClick={clearTasks}>Clear All Tasks</button>
      )}
    </div>
  )
}
