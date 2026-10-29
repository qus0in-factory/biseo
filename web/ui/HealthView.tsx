import { RefreshCw } from 'lucide-react'
import r from '../resources.json'
type Props = { loading: boolean; error?: string; onCheck: () => void }
export function HealthView({ loading, error, onCheck }: Props) {
  return (
    <>
      {!loading && error && <span className="err health-err">{r.errorPrefix}{error}</span>}
      <button
        className="icon-btn"
        onClick={onCheck}
        disabled={loading}
        aria-label={r.refresh}
        title={r.refresh}
      >
        <RefreshCw size={16} aria-hidden="true" className={loading ? 'spin' : undefined} />
      </button>
    </>
  )
}
