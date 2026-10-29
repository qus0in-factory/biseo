import { PanelLeft } from 'lucide-react'

export function PaneDrawerToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const label = open ? '왼쪽 패널 접기' : '왼쪽 패널 펼치기'
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      title={label}
      onClick={onToggle}
      className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
    >
      <PanelLeft size={17} aria-hidden="true" />
    </button>
  )
}
