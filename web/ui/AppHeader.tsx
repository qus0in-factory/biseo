import { LogOut } from 'lucide-react'
import { Button } from '../components/ui/button'
import { HeaderBrand } from './HeaderBrand'
import r from '../resources.json'

export interface AppHeaderProps {
  authed?: boolean
  busy?: boolean
  onLogout?: () => void
}

export function AppHeader({ authed, busy, onLogout }: AppHeaderProps) {
  return (
    <header className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
      <HeaderBrand />
      {authed && onLogout && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto shrink-0"
          onClick={onLogout}
          disabled={busy}
          aria-label={r.logout}
          title={r.logout}
        >
          <LogOut size={20} aria-hidden="true" />
        </Button>
      )}
    </header>
  )
}
