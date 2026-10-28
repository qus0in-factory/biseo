import { useAuth } from './app/useAuth'
import { useHealth } from './useHealth'
import { authApi } from './infra/authApi'
import { healthApi } from './infra/healthApi'
import { LoginForm } from './ui/LoginForm'
import { HealthView } from './ui/HealthView'
import r from './resources.json'
import './style.css'
export default function App() {
  const { authed, busy, code, login, logout, expire } = useAuth(authApi)
  const { data, loading, check } = useHealth(healthApi, authed, expire)
  return (
    <main className="card">
      <h1>{r.title}</h1>
      {!authed ? (
        <LoginForm busy={busy} onLogin={login} />
      ) : (
        <>
          <HealthView
            loading={loading}
            status={data?.status}
            error={data?.error}
            onCheck={check}
          />
          <button className="btn" onClick={logout} disabled={busy}>
            {r.logout}
          </button>
        </>
      )}
      {code && <p className="err">{r[code]}</p>}
    </main>
  )
}
