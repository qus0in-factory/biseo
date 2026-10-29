import { X } from 'lucide-react'

export function SheetHeader({
  title,
  onClose,
}: {
  title?: string
  onClose: () => void
}) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-border">
      {title && (
        <h2 id="sheet-title" className="text-base font-semibold">
          {title}
        </h2>
      )}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  )
}
