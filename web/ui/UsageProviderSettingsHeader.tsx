import { Button } from '../components/ui/button'
import r from '../resources.json'

export function UsageProviderSettingsHeader({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{r.usageProviderSettings}</h3>
        <Button type="button" variant="ghost" className="min-h-11 px-2" onClick={onClose}>{r.close}</Button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{r.usageProviderSettingsHint}</p>
    </>
  )
}
