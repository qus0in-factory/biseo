import { HeaderBrand } from './HeaderBrand'
import { HeaderMenuButton } from './HeaderMenuButton'
import { SessionActions } from './SessionActions'

export interface AppHeaderProps {
  authed?: boolean
  busy?: boolean
  onLogout?: () => void
}

export function AppHeader({ authed, busy, onLogout }: AppHeaderProps) {
  return (
    <header className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
      <div className="flex items-center gap-2 min-w-0">
        {authed && <HeaderMenuButton />}
        <HeaderBrand />
      </div>
      {authed && <SessionActions busy={busy} onLogout={onLogout} />}
    </header>
  )
}
