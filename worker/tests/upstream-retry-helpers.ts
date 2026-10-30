import type { TestContext } from 'node:test'
import { callUpstreamJson } from '../infra/herdr-upstream-http.js'

export async function run(env: any, m: 'GET' | 'POST', fn: (n: number) => Response) {
  let n = 0
  const f0 = globalThis.fetch
  globalThis.fetch = (async () => fn(++n)) as any
  try {
    return { res: await callUpstreamJson(env, '/herdr/turns/r1', m, undefined, 'tid'), n }
  } finally {
    globalThis.fetch = f0
  }
}

// ky waits for its backoff between retries; drive the mocked timers until the call settles
// so the tests exercise the retry policy without spending real seconds.
export async function drive<T>(t: TestContext, p: Promise<T>, stepMs = 600, maxTicks = 20): Promise<T> {
  let done = false
  const tracked = p.then(
    (v) => {
      done = true
      return v
    },
    (e) => {
      done = true
      throw e
    },
  )
  for (let i = 0; i < maxTicks && !done; i++) {
    await new Promise((r) => setImmediate(r))
    if (!done) t.mock.timers.tick(stepMs)
  }
  if (!done) throw new Error('retry driver did not settle')
  return tracked
}

export const err = (status: number) => Response.json({ error: 'x' }, { status })
export const ok = () => Response.json({ requestId: 'r1' }, { status: 200 })
