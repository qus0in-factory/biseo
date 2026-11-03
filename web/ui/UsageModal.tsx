import { Modal } from './Modal'
import { UsageModalBody } from './UsageModalBody'
import r from '../resources.json'
import { UsageModalDisplay } from './UsageModalDisplay'

const shell='fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] w-full flex-col rounded-t-lg bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:static sm:mx-auto sm:max-h-[85vh] sm:max-w-4xl sm:rounded-lg sm:p-5 xl:max-w-6xl'

export function UsageModal({ open, onClose, enabled = true }: { open: boolean; onClose: () => void; enabled?: boolean }) {
  return (<Modal open={open} title={r.usageTitle} onClose={onClose} layout="adaptive" className={shell}><UsageModalDisplay value={true}><UsageModalBody enabled={enabled && open} /></UsageModalDisplay></Modal>)
}
