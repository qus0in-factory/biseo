import { Eye, EyeOff } from 'lucide-react'
import { MarkdownToggleTrack } from './MarkdownToggleTrack'

export function UsagePaceSettingRow({ label, on, onToggle, ariaLabel }: {
  label: string; on: boolean; onToggle: () => void; ariaLabel: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
      <button type="button" role="switch" aria-checked={on} aria-label={ariaLabel} onClick={onToggle}
        className="flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <MarkdownToggleTrack on={on} left={<EyeOff size={14} aria-hidden="true" />} right={<Eye size={14} aria-hidden="true" />} />
      </button>
    </div>
  )
}
