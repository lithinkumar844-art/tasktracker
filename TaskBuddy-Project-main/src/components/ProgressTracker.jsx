import React from 'react'

export default function ProgressTracker({ tasks }) {
  const completedTasks = tasks.filter((t) => t.completed).length
  const totalTasks = tasks.length

  // Subtasks count toward progress too
  const allSubtasks = tasks.flatMap((t) => t.subtasks ?? [])
  const doneSubtasks = allSubtasks.filter((s) => s.done).length

  const total = totalTasks + allSubtasks.length
  const done = completedTasks + doneSubtasks
  const percentage = total === 0 ? 0 : (done / total) * 100

  return (
    <div className='progress-tracker'>
      <p>
        {completedTasks} out of {totalTasks} tasks Completed
        {allSubtasks.length > 0 && ` · ${doneSubtasks}/${allSubtasks.length} subtasks`}
      </p>

      <div className='progress-bar'>
        <div className='progress' style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}
