import { Button } from '../components/ui/button'
import r from '../resources.json'

export function UsageProviderShowAll({ hidden, onShowAll }: { hidden: string[]; onShowAll: () => void }) {
  if (hidden.length === 0) return null
  return <Button type="button" variant="outline" className="mt-2 min-h-11" onClick={onShowAll}>{r.usageProviderShowAll}</Button>
}
