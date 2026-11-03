import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '../components/ui/button'
import { SettingsModal } from './SettingsModal'
import r from '../resources.json'

export function SettingsButton() {
  const [open, setOpen] = useState(false)
  return <>
    <Button type="button" variant="ghost" size="icon" className="hover:bg-muted" aria-label={r.settings} title={r.settings} onClick={() => setOpen(true)}>
      <Settings size={16} aria-hidden="true" />
    </Button>
    <SettingsModal open={open} onClose={() => setOpen(false)} />
  </>
}
