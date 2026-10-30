import r from '../resources.json'

type P = {
  hidden: boolean
  onToggleHide: () => void
}

export function UsageOrderItemActions({ hidden, onToggleHide }: P) {
  return (
    <button type="button" onClick={onToggleHide}>
      {hidden ? r.usageShowItem : r.usageHideItem}
    </button>
  )
}
