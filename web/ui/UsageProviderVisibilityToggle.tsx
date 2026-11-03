import { Eye, EyeOff } from 'lucide-react'
import { MarkdownToggleTrack } from './MarkdownToggleTrack'
import r from '../resources.json'

export function UsageProviderVisibilityToggle({ provider, hidden, onToggle }: {
  provider: string; hidden: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!hidden}
      aria-label={`${r.usageProviderVisible}: ${provider}`}
      onClick={onToggle}
      className="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <MarkdownToggleTrack
        on={!hidden}
        left={<EyeOff size={14} aria-hidden="true" />}
        right={<Eye size={14} aria-hidden="true" />}
      />
    </button>
  )
}
