import type { TimelineItem } from '../domain/timeline-types.js'
import { parseCompletedTurn } from './zero-shot-sse-parse-fixture.js'

export async function waitCompletedTurn(
  body: ReadableStream<Uint8Array>,
  id: string,
  ms = 1500,
): Promise<TimelineItem> {
  const reader = body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      (async () => {
        for (;;) {
          const { done, value } = await reader.read()
          if (done) throw new Error('stream_closed')
          buf += dec.decode(value, { stream: true })
          const hit = parseCompletedTurn(buf, id)
          if (hit) return hit
        }
      })(),
      new Promise<never>((_, rej) => {
        timer = setTimeout(() => rej(new Error('sse_timeout')), ms)
      }),
    ])
  } finally {
    clearTimeout(timer)
    await reader.cancel().catch(() => {})
  }
}
