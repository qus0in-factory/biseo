import { useEffect, useState } from 'react'

const visibleNow = () =>
  typeof document !== 'undefined' && document.visibilityState === 'visible'

export function useTabVisible() {
  const [visible, setVisible] = useState(visibleNow)
  useEffect(() => {
    const onChange = () => setVisible(visibleNow())
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
  return visible
}
