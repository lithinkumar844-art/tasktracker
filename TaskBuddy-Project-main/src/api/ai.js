// ⚠️ DEMO ONLY: a VITE_ variable is bundled into the browser code, so anyone
// can read this key in dev tools. In a real app, call the AI from your own
// backend (Node/serverless) and keep the key on the server.
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function breakIntoSubtasks(taskText) {
  if (!API_KEY) throw new Error('Add VITE_ANTHROPIC_API_KEY to your .env file')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-5-5',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Break this task into 3 to 6 short, concrete subtasks. Reply with only a JSON array of strings.\n\nTask: ${taskText}`,
        },
      ],
    }),
  })
  if (!res.ok) throw new Error(`AI request failed (${res.status})`)

  const data = await res.json()
  const text = data.content?.find((b) => b.type === 'text')?.text ?? ''
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Could not read the AI response')

  const steps = JSON.parse(match[0])
    .filter((s) => typeof s === 'string' && s.trim())
    .slice(0, 8)
  if (steps.length === 0) throw new Error('The AI returned no subtasks')
  return steps
}
