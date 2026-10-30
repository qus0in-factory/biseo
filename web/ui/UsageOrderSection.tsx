import { UsageOrderItem } from './UsageOrderItem'

export function UsageOrderSection({ providers, orderState }: any) {
  return (
    <ul>
      {providers.map((p: any) => (
        <UsageOrderItem
          key={p.provider}
          id={p.provider}
          hidden={orderState.hidden.includes(p.provider)}
          onToggleHide={() => orderState.toggleHide(p.provider)}
        />
      ))}
    </ul>
  )
}