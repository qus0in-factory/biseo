import { useState } from 'react'
import { Gauge } from 'lucide-react'
import { Button } from '../components/ui/button'
import { UsageModal } from './UsageModal'
import r from '../resources.json'

export function UsageButton({ enabled = true }: { enabled?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="min-w-11 shrink-0 px-0 text-xs hover:bg-muted sm:px-3 sm:text-sm"
        aria-label={r.usageTab}
        title={r.usageTab}
        onClick={() => setOpen(true)}
      >
        <Gauge size={16} aria-hidden="true" />
        <span className="hidden sm:inline">{r.usageTab}</span>
      </Button>
      <UsageModal open={open} onClose={() => setOpen(false)} enabled={open} />
    </>
  )
}
