import { X } from 'lucide-react'
import { Button } from '../components/ui/button'
import r from '../resources.json'

export function CancelTurnButton({ requestId, title, onCancel }: { requestId: string; title?: string; onCancel: (id: string) => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => onCancel(requestId)}
      aria-label={`${r.cancel} ${requestId}`}
      title={title ?? r.cancel}
      className="ml-auto border border-danger text-danger hover:text-danger"
    >
      <X size={14} aria-hidden="true" />
    </Button>
  )
}
