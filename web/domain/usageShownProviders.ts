import { resolveUsageIds } from './usageOrder.js'

export const shownUsageProviders = <T extends { provider: string }>(
  providers: T[],
  order: string[],
  hidden: string[],
): T[] => {
  const byId = new Map(providers.map((p) => [p.provider, p]))
  return resolveUsageIds(
    order,
    providers.map((p) => p.provider),
  )
    .filter((id) => !hidden.includes(id))
    .flatMap((id) => (byId.has(id) ? [byId.get(id) as T] : []))
}
