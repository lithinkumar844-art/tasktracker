import React from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dayKey, toDateKey } from '../utils/dates'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function Analytics({ tasks }) {
  // Last 7 days, oldest first
  const data = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = toDateKey(d)
    data.push({
      day: d.toLocaleDateString(undefined, { weekday: 'short' }),
      completed: tasks.filter((t) => t.completedAt && dayKey(t.completedAt) === key).length,
    })
  }

  const completed = tasks.filter((t) => t.completed).length
  const rate = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100)

  // Weekday with the most completed tasks
  const perWeekday = Array(7).fill(0)
  tasks.forEach((t) => {
    if (t.completedAt) perWeekday[new Date(t.completedAt).getDay()]++
  })
  const max = Math.max(...perWeekday)
  const bestDay = max === 0 ? '—' : WEEKDAYS[perWeekday.indexOf(max)]

  return (
    <div className='analytics'>
      <h2>Analytics</h2>
      <div className='stats'>
        <div><strong>{rate}%</strong><small>Completion rate</small></div>
        <div><strong>{bestDay}</strong><small>Most productive day</small></div>
      </div>
      <div className='chart'>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <XAxis dataKey="day" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <YAxis allowDecimals={false} width={24} tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.08)' }} />
            <Bar dataKey="completed" name="Completed" fill="#feba01" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
