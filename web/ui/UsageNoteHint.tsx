import { Info } from 'lucide-react'
import type { UsageProvider } from '../domain/usage'
import { compactUsageNote, usageReasonText } from '../domain/usage-note'
import { cacheNote } from '../domain/usage-cache'
import { HintPopover } from './HintPopover'
import r from '../resources.json'

export function UsageNoteHint({ provider }: { provider: UsageProvider }) {
  if (!compactUsageNote(provider)) return null
  const text = [cacheNote(provider, r), usageReasonText(provider.reason)]
    .filter(Boolean).join('\n')
  if (!text) return null
  return <span className="absolute right-0 top-0 flex h-full items-center">
    <HintPopover label={text} className="size-4 text-muted-foreground">
      <Info className="size-4" aria-hidden="true" />
    </HintPopover>
  </span>
}
