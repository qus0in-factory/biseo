import { useHealth } from './useHealth'
import r from './resources.json'
import './style.css'

export default function App() {
  const { data, loading, check } = useHealth()

  return (
    <main className="card">
      <h1>{r.title}</h1>
      {loading && <p>{r.loading}</p>}
      {!loading && data?.status && (
        <p className="ok">{r.statusPrefix}{data.status}</p>
      )}
      {!loading && data?.error && (
        <p className="err">{r.errorPrefix}{data.error}</p>
      )}
      <button className="btn" onClick={check} disabled={loading}>
        {r.refresh}
      </button>
    </main>
  )
}
