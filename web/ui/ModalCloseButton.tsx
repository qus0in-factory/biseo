import { X } from 'lucide-react'
import { Button } from '../components/ui/button'
import r from '../resources.json'
export function ModalCloseButton({onClose}: {onClose: () => void}) {
 return <Button type="button" variant="outline" size="icon" onClick={onClose}
  aria-label={r.close} title={r.close}><X size={18} aria-hidden="true"/></Button>
}
