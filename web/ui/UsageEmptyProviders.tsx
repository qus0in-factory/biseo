import { Button } from '../components/ui/button'
import r from '../resources.json'

export function UsageEmptyProviders({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="rounded-md border border-dashed border-border p-4 text-center">
      <p className="text-sm text-muted-foreground">{r.usageProviderEmpty}</p>
      <Button type="button" variant="outline" className="mt-2 min-h-11" onClick={onOpen}>{r.usageProviderSettings}</Button>
    </div>
  )
}
