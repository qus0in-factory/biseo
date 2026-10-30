export * from './usageOrderStorage.js'

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

export * from './usageOrderMove.js'
