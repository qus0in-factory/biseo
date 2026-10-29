import { LogOut } from 'lucide-react'
import r from '../resources.json'

export interface AppHeaderProps {
  authed?: boolean
  busy?: boolean
  onLogout?: () => void
}

export function AppHeader({ authed, busy, onLogout }: AppHeaderProps) {
  return (
    <header className="header">
      <h1 className="header-title">
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          className="header-favicon"
        />
        <span className="header-text">{r.title}</span>
      </h1>
      {authed && onLogout && (
        <button
          type="button"
          className="icon-btn"
          onClick={onLogout}
          disabled={busy}
          aria-label={r.logout}
          title={r.logout}
        >
          <LogOut size={20} aria-hidden="true" />
        </button>
      )}
    </header>
  )
}
