import r from '../resources.json'
type Props = { loading: boolean; status?: string; error?: string; onCheck: () => void }
export function HealthView({ loading, error, onCheck }: Props) {
  return (
    <>
      {loading && <p>{r.loading}</p>}
      {!loading && error && <p className="err">{r.errorPrefix}{error}</p>}
      <button className="btn" onClick={onCheck} disabled={loading}>
        {r.refresh}
      </button>
    </>
  )
}
