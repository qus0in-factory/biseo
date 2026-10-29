import { calculateBackoff } from './backoff'

export function createRetryScheduler(onRetry: () => void) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let attempt = 0

  const cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }

  const schedule = () => {
    cancel()
    timer = setTimeout(onRetry, calculateBackoff(attempt++))
  }

  const reset = () => {
    attempt = 0
    cancel()
  }

  return { schedule, reset, cancel }
}
