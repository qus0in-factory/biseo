import { onStreamOpen } from './streamOpenEvent'

type Hooks = { check: () => void; abort: () => void }

export function bindHealthLifecycle({ check, abort }: Hooks): () => void {
  const win = typeof window === 'undefined' ? undefined : window
  const doc = typeof document === 'undefined' ? undefined : document
  const onVisible = () => {
    if (!doc || doc.visibilityState === 'visible') check()
    else abort()
  }
  const onPageShow = (e: PageTransitionEvent) => {
    if (e.persisted) check()
  }
  win?.addEventListener('online', check)
  win?.addEventListener('pageshow', onPageShow)
  win?.addEventListener('pagehide', abort)
  doc?.addEventListener('visibilitychange', onVisible)
  const offStream = onStreamOpen(check)
  return () => {
    win?.removeEventListener('online', check)
    win?.removeEventListener('pageshow', onPageShow)
    win?.removeEventListener('pagehide', abort)
    doc?.removeEventListener('visibilitychange', onVisible)
    offStream()
  }
}
