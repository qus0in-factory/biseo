import { useState, useRef, type KeyboardEvent } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { canInputTarget } from '../domain/paneState'
import { shouldSendOnEnter } from './composerKey'
import { validateMessageInput } from '../domain/schemas/messageInput'

export function useComposer(
  target: PaneSummary | undefined,
  busy: boolean,
  onSend: (text: string) => void,
  hold = false,
) {
  const [t, setT] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const valid = validateMessageInput(t)
  const canSend = canInputTarget(target) && !busy && !hold && valid.ok

  const submit = () => {
    if (!canSend || !valid.ok) return
    onSend(valid.data.text)
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
