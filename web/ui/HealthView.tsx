import { RefreshCw } from 'lucide-react'
import { Button } from '../components/ui/button'
import r from '../resources.json'
type Props = { loading: boolean; error?: string; onCheck: () => void }
export function HealthView({ loading, error, onCheck }: Props) {
  return (
    <>
      {!loading && error && <span className="text-xs text-error">{r.errorPrefix}{error}</span>}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hover:bg-muted"
        onClick={onCheck}
        disabled={loading}
        aria-busy={loading}
        aria-label={r.refresh}
        title={r.refresh}
      >
        <RefreshCw size={16} aria-hidden="true" className={loading ? 'motion-safe:animate-spin' : undefined} />
      </Button>
    </>
  )
}
