import { useState, useRef, type KeyboardEvent } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { shouldSendOnEnter } from './composerKey'

export function useComposer(
  target: PaneSummary | undefined,
  busy: boolean,
  onSend: (text: string) => void,
) {
  const [t, setT] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const canSend = Boolean(target?.sendable) && !busy && t.trim().length > 0

  const submit = () => {
    if (!canSend) return
    onSend(t)
    setT('')
    ref.current?.focus()
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (shouldSendOnEnter(e)) {
      e.preventDefault()
      submit()
    }
  }

  return { t, setT, ref, canSend, submit, onKey }
}
