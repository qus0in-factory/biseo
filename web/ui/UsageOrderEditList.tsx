import { UsageOrderItem } from './UsageOrderItem'
import { moveUsageIdTo } from '../domain/usageOrder'

type P = {
  d: string[]
  g: string | null
  setG: (v: string | null) => void
  setD: (v: string[] | ((prev: string[]) => string[])) => void
  orderState: any
}

export function UsageOrderEditList({
  d,
  g,
  setG,
  setD,
  orderState,
}: P) {
  return (
    <ul>
      {d.map((id: string) => (
        <UsageOrderItem
          key={id}
          id={id}
          hidden={orderState.hidden.includes(id)}
          draggable
          onDragStart={() => setG(id)}
          onDragOver={(ev: any) => {
            ev.preventDefault()
            if (g && g !== id) setD(moveUsageIdTo(d, g, d.indexOf(id)))
          }}
          onDragEnd={() => setG(null)}
          onToggleHide={() => orderState.toggleHide(id)}
        />
      ))}
    </ul>
  )
}
