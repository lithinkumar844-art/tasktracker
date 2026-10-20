import { toDateKey } from './dates'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

// "Submit report Friday 5pm high priority work"
//  -> { text: 'Submit report', dueDate, dueTime: '17:00', priority: 'High', category: 'Work' }
export function parseTaskText(input) {
  let text = ` ${input} `
  const result = {}
  const take = (re) => {
    const m = text.match(re)
    if (m) text = text.replace(re, ' ')
    return m
  }

  // Priority
  let m = take(/\b(high|medium|low)\s+priority\b/i)
  if (m) result.priority = cap(m[1])
  else if (take(/\b(urgent|asap)\b/i)) result.priority = 'High'

  // Time (5pm, 5:30 pm, at 5pm)
  m = take(/\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i)
  if (m) {
    let h = Number(m[1]) % 12
    if (m[3].toLowerCase() === 'pm') h += 12
    result.dueTime = `${String(h).padStart(2, '0')}:${m[2] ?? '00'}`
  }

  // Date
  const base = new Date()
  const setDate = (d) => (result.dueDate = toDateKey(d))
  const lead = '(?:(?:by|on|due)\\s+)?'
  if ((m = take(new RegExp(`${lead}\\b(\\d{4}-\\d{2}-\\d{2})\\b`, 'i')))) {
    result.dueDate = m[1]
  } else if (take(new RegExp(`${lead}\\btoday\\b`, 'i'))) {
    setDate(base)
  } else if (take(new RegExp(`${lead}\\btomorrow\\b`, 'i'))) {
    base.setDate(base.getDate() + 1)
    setDate(base)
  } else if ((m = take(new RegExp(`${lead}\\bin\\s+(\\d+)\\s+days?\\b`, 'i')))) {
    base.setDate(base.getDate() + Number(m[1]))
    setDate(base)
  } else if ((m = take(new RegExp(`${lead}\\b(?:next\\s+)?(${DAYS.join('|')})\\b`, 'i')))) {
    const target = DAYS.indexOf(m[1].toLowerCase())
    const ahead = (target - base.getDay() + 7) % 7 || 7
    base.setDate(base.getDate() + ahead)
    setDate(base)
  }

  // Category: "#work", "category work", "for work" or a trailing keyword
  m =
    take(/(?:#|\bcategory\s+|\bfor\s+)(work|personal|general)\b/i) ||
    take(/\b(work|personal|general)\s*$/i)
  if (m) result.category = cap(m[1])

  result.text = text.replace(/\s+/g, ' ').trim() || input.trim()
  return result
}
