import { useEffect } from 'react'
import { bindVisualViewport } from '../infra/visualViewportBind.js'

export function useVisualViewportBind(): void {
  useEffect(() => {
    const unbind = bindVisualViewport()
    return () => {
      unbind()
    }
  }, [])
}
