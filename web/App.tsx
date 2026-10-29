import { useAuth } from './app/useAuth'
import { useHealth } from './useHealth'
import { authApi } from './infra/authApi'
import { healthApi } from './infra/healthApi'
import { AppContent } from './ui/AppContent'
import r from './resources.json'
import './style.css'

export default function App() {
  const { authed, busy, ready, code, login, logout, expire } = useAuth(authApi)
  const { data, loading, check } = useHealth(healthApi, authed, expire)

  if (!ready) return <main className="card"><h1>{r.title}</h1><p>{r.loading}</p></main>
  return (
    <main className="card">
      <header className="header">
        <h1>{r.title}</h1>
        {authed && <button className="btn" onClick={logout} disabled={busy}>{r.logout}</button>}
      </header>
      <AppContent
        authed={authed}
        busy={busy}
        login={login}
        loading={loading}
        data={data}
        check={check}
      />
      {code && <p className="err">{r[code]}</p>}
    </main>
  )
}
