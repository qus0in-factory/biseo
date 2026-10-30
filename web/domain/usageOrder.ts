export * from './usageOrderStorage.js'

export const resolveUsageIds = (order: string[], known: string[]): string[] => [
  ...order.filter((id) => known.includes(id)),
  ...known.filter((id) => !order.includes(id)),
]
