import { UsageOrderItemActions } from './UsageOrderItemActions'

type P = {
  id: string
  hidden: boolean
  onToggleHide: () => void
}

export function UsageOrderItem({ id, hidden, onToggleHide }: P) {
  return (
    <li className="flex items-center justify-between gap-2 rounded border px-2 py-1">
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