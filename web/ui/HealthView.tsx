import r from '../resources.json'
type Props = { loading: boolean; status?: string; error?: string; onCheck: () => void }
export function HealthView({ loading, status, error, onCheck }: Props) {
  return (
    <>
      {loading && <p>{r.loading}</p>}
      {!loading && status && <p className="ok">{r.statusPrefix}{status}</p>}
      {!loading && error && <p className="err">{r.errorPrefix}{error}</p>}
      <button className="btn" onClick={onCheck} disabled={loading}>
        {r.refresh}
      </button>
    </>
  )
}
