import { Settings2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import r from '../resources.json'

export function UsageSettingsButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="min-h-11 px-2 sm:px-3"
      aria-expanded={open}
      aria-controls="usage-provider-settings"
      onClick={onToggle}
    >
      <Settings2 size={16} aria-hidden="true" />
      <span className="text-xs sm:text-sm">{r.usageProviderSettings}</span>
    </Button>
  )
}
