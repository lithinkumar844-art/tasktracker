import React from 'react'

const BADGES = [
  { id: 'tasks5', label: '5 tasks done', icon: '🥉', earned: (c) => c.completed >= 5 },
  { id: 'tasks25', label: '25 tasks done', icon: '🥇', earned: (c) => c.completed >= 25 },
  { id: 'streak3', label: '3-day streak', icon: '🔥', earned: (c) => c.bestStreak >= 3 },
  { id: 'streak7', label: '7-day streak', icon: '🏆', earned: (c) => c.bestStreak >= 7 },
]

export default function Badges({ completed, bestStreak }) {
  return (
    <div className='badges'>
      {BADGES.map((b) => {
        const earned = b.earned({ completed, bestStreak })
        return (
          <span key={b.id} className={`badge ${earned ? 'earned' : ''}`} title={b.label}>
            {b.icon} {b.label}
          </span>
        )
      })}
    </div>
  )
}
