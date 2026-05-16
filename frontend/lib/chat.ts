import { API_BASE_URL } from '@/lib/config'

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Stream an AI Scout response via SSE.
 * Calls onStatus for node-level progress updates (e.g. "Searching flights..."),
 * onToken for each streamed response token, onDone when complete, onError on failure.
 */
export async function streamChat(
  messages: ChatMsg[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
  onStatus?: (status: string) => void,
  sessionId?: string,
): Promise<void> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, session_id: sessionId ?? null }),
    })
  } catch {
    onError('Could not reach AI Scout. Please check your connection.')
    return
  }

  if (!response.ok) {
    onError(`AI Scout returned an error (${response.status}). Please try again.`)
    return
  }

  const reader = response.body?.getReader()
  if (!reader) { onError('No response stream available.'); return }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') { onDone(); return }
      try {
        const parsed = JSON.parse(data)
        if (parsed.token)  onToken(parsed.token)
        if (parsed.status) onStatus?.(parsed.status)
        if (parsed.error)  { onError(parsed.error); return }
      } catch {
        // ignore malformed SSE lines
      }
    }
  }
  onDone()
}
