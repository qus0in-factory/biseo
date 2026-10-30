const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []

export type UsageOrder = { order: string[] }

export const parseUsageOrder = (raw: string | null): UsageOrder => {
  try {
    const v = JSON.parse(raw ?? '') as { order?: unknown }
    return { order: strList(v.order) }
  } catch {
    return { order: [] }
  }
}

export const serializeUsageOrder = (o: UsageOrder): string =>
  JSON.stringify(o)
