const pad = (n) => String(n).padStart(2, '0')

// Local date as YYYY-MM-DD
export const toDateKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// ISO timestamp -> local YYYY-MM-DD
export const dayKey = (iso) => toDateKey(new Date(iso))

// Consecutive-day streak from a list of YYYY-MM-DD strings
export const computeStreak = (days) => {
  const set = new Set(days)
  const sorted = [...set].sort()

  // Best streak ever
  let best = 0
  let run = 0
  let prev = null
  for (const key of sorted) {
    const d = new Date(key + 'T00:00:00')
    if (prev) {
      const next = new Date(prev)
      next.setDate(next.getDate() + 1)
      run = toDateKey(next) === key ? run + 1 : 1
    } else {
      run = 1
    }
    best = Math.max(best, run)
    prev = d
  }

  // Current streak: today counts if done, otherwise start from yesterday
  const cursor = new Date()
  if (!set.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let current = 0
  while (set.has(toDateKey(cursor))) {
    current++
    cursor.setDate(cursor.getDate() - 1)
  }
  return { current, best }
}
