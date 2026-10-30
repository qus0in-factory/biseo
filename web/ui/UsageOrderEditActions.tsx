import r from '../resources.json'

type P = {
  d: string[]
  orderState: any
  setE: (v: boolean) => void
}

export function UsageOrderEditActions({ d, orderState, setE }: P) {
  return (
    <>
      <button
        type="button"
        title={r.usageEditOrderDone}
        onClick={() => { orderState.setOrder(d); setE(false) }}
      >
        {r.status_done}
      </button>
      <button
        type="button"
        title={r.usageEditOrderCancel}
        onClick={() => setE(false)}
      >
        {r.cancel}
      </button>
    </>
  )
}
