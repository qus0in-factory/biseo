import type { RefObject, KeyboardEvent } from 'react'
import { Textarea } from '../components/ui/textarea'

export function ComposerField({ inputRef, value, onChange, onKey, placeholder }: {
  inputRef: RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (v: string) => void
  onKey: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder: string
}) {
  return (
    <Textarea
      ref={inputRef}
      className="min-h-[2.8rem] max-h-24 flex-1 px-2 py-1.5"
      rows={2}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKey}
    />
  )
}
