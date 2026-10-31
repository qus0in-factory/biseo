import { LogOut } from 'lucide-react'
import { Button } from '../components/ui/button'
import { SettingsButton } from './SettingsButton'
import r from '../resources.json'

export function SessionActions({ busy, onLogout }: { busy?: boolean; onLogout?: () => void }) {
  return <div className="ml-auto flex shrink-0 items-center gap-1">
    <SettingsButton />
    {onLogout && <Button type="button" variant="ghost" size="icon"
      onClick={onLogout} disabled={busy} aria-label={r.logout}>
      <LogOut size={20} aria-hidden="true" />
    </Button>}
  </div>
}
