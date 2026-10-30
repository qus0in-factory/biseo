import { UsageOrderItemActions } from './UsageOrderItemActions'

type P = {
  id: string
  hidden: boolean
  onToggleHide: () => void
  draggable?: boolean
  onDragStart?: () => void
  onDragOver?: (ev: any) => void
  onDragEnd?: () => void
}

export function UsageOrderItem({
  id,
  hidden,
  onToggleHide,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
}: P) {
  return (
    <li
      className="flex items-center justify-between gap-2 rounded border px-2 py-1"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <span className={hidden ? 'text-muted-foreground line-through' : ''}>
        {id}
      </span>
      <UsageOrderItemActions
        hidden={hidden}
        onToggleHide={onToggleHide}
      />
    </li>
  )
}
