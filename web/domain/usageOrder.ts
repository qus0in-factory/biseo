export type UsageOrder = { order: string[]; hidden: string[] }

const strList = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [])

export const parseUsageOrder = (raw: string | null): UsageOrder => {
  try {
    const v = JSON.parse(raw ?? '') as { order?: unknown; hidden?: unknown }
    return { order: strList(v.order), hidden: strList(v.hidden) }
  } catch {
    return { order: [], hidden: [] }
  }
}

export const serializeUsageOrder = (o: UsageOrder): string => JSON.stringify(o)

export const resolveUsageIds = (order: string[], known: string[]): string[] => [
  ...order.filter((id) => known.includes(id)),
  ...known.filter((id) => !order.includes(id)),
]

export const moveUsageId = (list: string[], id: string, dir: number): string[] => {
  const i = list.indexOf(id)
  const j = i + (dir < 0 ? -1 : 1)
  if (i < 0 || j < 0 || j >= list.length) return list
  const next = [...list]
  next[i] = list[j]
  next[j] = id
  return next
}
