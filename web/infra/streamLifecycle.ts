export function bindStreamLifecycle(onTrigger: () => void): () => void {
  const hasWin = typeof window !== 'undefined'
  const hasDoc = typeof document !== 'undefined'
  const onVis = () => {
    if (hasDoc && document.visibilityState === 'visible') onTrigger()
  }
  const onPageShow = (e: PageTransitionEvent) => {
    if (e.persisted) onTrigger()
  }
  if (hasWin) {
    window.addEventListener('online', onTrigger)
    window.addEventListener('pageshow', onPageShow)
  }
  if (hasDoc) document.addEventListener('visibilitychange', onVis)
  return () => {
    if (hasWin) {
      window.removeEventListener('online', onTrigger)
      window.removeEventListener('pageshow', onPageShow)
    }
    if (hasDoc) document.removeEventListener('visibilitychange', onVis)
  }
}
