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
      className="ml-auto border border-[#b91c1c] px-2 py-0.5 text-xs text-[#b91c1c] hover:text-[#b91c1c]"
    >
      <X size={14} aria-hidden="true" />
    </Button>
  )
}
