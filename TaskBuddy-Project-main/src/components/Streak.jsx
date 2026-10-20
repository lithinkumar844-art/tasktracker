import React from 'react'

export default function Streak({ streak }) {
  return (
    <div className='streak'>
      <span>🔥 {streak.current}-day streak</span>
      <small>Best: {streak.best}</small>
    </div>
  )
}
