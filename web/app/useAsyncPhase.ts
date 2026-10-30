import { useCallback, useState } from 'react'

export function useAsyncPhase() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const start = useCallback(() => {
    setLoading(true)
    setError(null)
  }, [])
  const done = useCallback((e: string | null) => {
    setLoading(false)
    setError(e)
  }, [])
  const resetPhase = useCallback((active: boolean) => {
    setError(null)
    setLoading(active)
  }, [])
  return { loading, error, start, done, resetPhase }
}
