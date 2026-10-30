import { resolveUsageIds } from '../domain/usageOrder'
import type { UsageOrderState } from '../app/useUsageOrder'
import type { UsageProvider } from '../domain/usage'
import { UsageOrderItem } from './UsageOrderItem'
import r from '../resources.json'

type P = { providers: UsageProvider[]; orderState: UsageOrderState }

export function UsageOrderSection({ providers, orderState }: P) {
  const ids = resolveUsageIds(
    orderState.order,
    providers.map((p) => p.provider),
  )
  return (
    <details className="mb-2 text-xs">
      <summary className="cursor-pointer text-muted-foreground">{r.usageEditOrder}</summary>
      <ul className="mt-1 flex flex-col gap-1">
        {ids.map((id) => (
          <UsageOrderItem key={id} id={id} hidden={orderState.hidden.includes(id)}
            onMove={(dir) => orderState.move(ids, id, dir)} onToggleHide={() => orderState.toggleHide(id)} />
        ))}
      </ul>
    </details>
  )
}
