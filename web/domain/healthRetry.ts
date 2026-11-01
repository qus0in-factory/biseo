import{ApiError,type Health,type HealthPort}from'./auth.js'

export type HealthResult =
  | { status: 'ok'; data: Health }
  | { status: 'auth' }
  | { status: 'failed' }
  | { status: 'aborted' }

const isAbort = (e: unknown) => (e as { name?: string } | null)?.name === 'AbortError'
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function loadHealth(
  port: HealthPort,
  signal: AbortSignal,
  retryDelaysMs: readonly number[],
): Promise<HealthResult> {
  for (let attempt = 0; ; attempt++) {
    if (signal.aborted) return { status: 'aborted' }
    try {
      return { status: 'ok', data: await port.getHealth(signal) }
    } catch (e) {
      if (signal.aborted || isAbort(e)) return { status: 'aborted' }
      if (e instanceof ApiError && e.code === 'authFailed') return { status: 'auth' }
      if (attempt >= retryDelaysMs.length) return { status: 'failed' }
      await sleep(retryDelaysMs[attempt])
    }
  }
}
