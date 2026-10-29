import { LogOut } from 'lucide-react'
import { Button } from '../components/ui/button'
import { HeaderBrand } from './HeaderBrand'
import { HeaderMenuButton } from './HeaderMenuButton'
import r from '../resources.json'

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
      {authed && onLogout && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto shrink-0"
          onClick={onLogout}
          disabled={busy}
          aria-label={r.logout}
        >
          <LogOut size={20} aria-hidden="true" />
        </Button>
      )}
    </header>
  )
}
