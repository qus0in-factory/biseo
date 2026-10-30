const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []

export type UsageOrder = { order: string[]; hidden: string[] }

export const parseUsageOrder = (raw: string | null): UsageOrder => {
  try {
    const v = JSON.parse(raw ?? '') as { order?: unknown; hidden?: unknown }
    return { order: strList(v.order), hidden: strList(v.hidden) }
  } catch {
    return { order: [], hidden: [] }
  }
}

export const serializeUsageOrder = (o: UsageOrder): string =>
  JSON.stringify(o)
