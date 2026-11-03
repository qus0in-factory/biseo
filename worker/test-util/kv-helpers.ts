export function createMockKv(initial: Record<string, string> = {}) {
  const map = new Map<string, string>(Object.entries(initial))
  return {
    map,
    async get(key: string) { return map.get(key) ?? null },
    async put(key: string, val: string) { map.set(key, val) },
    async delete(key: string) { map.delete(key) },
  } as any
}
