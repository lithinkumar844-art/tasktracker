import React, { useRef, useState } from 'react'
import { parseTaskText } from '../utils/parseTask'

const SpeechRecognition =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

export default function TaskForm({ addTask }) {
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('General')
  const [dueDate, setDueDate] = useState('')
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!task.trim()) return // ignore empty tasks

    // Smart parsing: "Submit report Friday 5pm high priority work"
    const parsed = parseTaskText(task)
    addTask({
      text: parsed.text,
      priority: parsed.priority ?? priority,
      category: parsed.category ?? category,
      dueDate: parsed.dueDate ?? dueDate,
      dueTime: parsed.dueTime ?? '',
      completed: false,
      completedAt: null,
      subtasks: [],
    })

    // Reset state
    setTask('')
    setPriority('Medium')
    setCategory('General')
    setDueDate('')
  }

  const toggleVoice = () => {
    if (listening) {
      recRef.current?.stop()
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.onresult = (e) => setTask(e.results[0][0].transcript)
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  return (
    <form onSubmit={handleSubmit} className='task-form'>
      <div id="inp">
        <input
          type="text"
          placeholder='Try: Submit report Friday 5pm high priority work'
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        {SpeechRecognition && (
          <button
            type='button'
            className={`mic-btn ${listening ? 'listening' : ''}`}
            onClick={toggleVoice}
            aria-label={listening ? 'Stop listening' : 'Add task by voice'}
          >
            🎤
          </button>
        )}
        <span><button type='submit'>Add Task</button></span>
      </div>

      <div id="btns">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
        />
      </div>
    </form>
  )
}
