import { useAuth } from './app/useAuth'
import { useHealth } from './useHealth'
import { authApi } from './infra/authApi'
import { healthApi } from './infra/healthApi'
import { AppHeader } from './ui/AppHeader'
import { AppContent } from './ui/AppContent'
import { AppFooter } from './ui/AppFooter'
import r from './resources.json'
import './style.css'

export default function App() {
  const { authed, busy, ready, code, login, logout, expire } = useAuth(authApi)
  const { data, loading, check } = useHealth(healthApi, authed, expire)

  if (!ready) return <main className="card"><AppHeader /><p>{r.loading}</p></main>
  return (
    <main className="card">
      <AppHeader authed={authed} busy={busy} onLogout={logout} />
      <AppContent
        authed={authed}
        busy={busy}
        login={login}
        loading={loading}
        data={data}
        check={check}
      />
      {code && <p className="err">{r[code]}</p>}
      {authed && <AppFooter />}
    </main>
  )
}
