import { useState } from 'react'
import { UsageOrderEditList } from './UsageOrderEditList'
import { UsageOrderEditActions } from './UsageOrderEditActions'
import { resolveUsageIds } from '../domain/usageOrder'
import r from '../resources.json'

export function UsageOrderSection({ providers, orderState }: any) {
  const ids = resolveUsageIds(
    orderState.order,
    providers.map((p: any) => p.provider)
  )
  const [e, setE] = useState(false)
  const [d, setD] = useState(ids)
  const [g, setG] = useState<any>(null)
  if (!e) {
    return (
      <button type="button" onClick={() => { setD(ids); setE(true) }}>
        {r.usageEditOrder}
      </button>
    )
  }
  return (
    <div>
      <UsageOrderEditList
        d={d}
        g={g}
        setG={setG}
        setD={setD}
        orderState={orderState}
      />
      <UsageOrderEditActions d={d} orderState={orderState} setE={setE} />
    </div>
  )
}
