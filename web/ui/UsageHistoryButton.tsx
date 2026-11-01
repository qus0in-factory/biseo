import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Modal } from './Modal'
import { UsageHistoryBody } from './UsageHistoryBody'
import r from '../resources/usage-history.json'

export function UsageHistoryButton({ provider }: { provider: string }) {
  const [open, setOpen] = useState(false)
  return <>
    <Button variant="ghost" size="icon" aria-label={`${provider} ${r.open}`}
      title={r.open} aria-haspopup="dialog" onClick={() => setOpen(true)}>
      <Search size={16} aria-hidden="true" />
    </Button>
    <Modal open={open} title={`${provider} · ${r.title}`} onClose={() => setOpen(false)} small>
      {open && <UsageHistoryBody provider={provider} />}
    </Modal>
  </>
}
