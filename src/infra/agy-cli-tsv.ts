import type { AgyGroup } from './agy-quota-types.js'
import { cliFraction, cliReset } from './agy-cli-fields.js'
import { cliWindow } from './agy-cli-windows.js'
import { cliPoolFamilies } from './agy-cli-pools.js'
import { cliRows } from './agy-cli-rows.js'

export function parseAgyCliTsv(out: string): AgyGroup[] | null {
  const by = new Map<string, AgyGroup>()
  for (const [pool, win, rem, rst] of cliRows(out)) {
    const f = cliFraction(rem ?? '')
    if (!pool || !win || f === null) continue
    const w = cliWindow(win)
    let g = by.get(pool)
    if (!g) {
      g = { displayName: pool, buckets: [], families: cliPoolFamilies(pool) ?? ['unknown'] }
      by.set(pool, g)
    }
    const b = { bucketId: w, displayName: win.trim(), window: w, remainingFraction: f, resetTime: cliReset(rst ?? '') }
    g.buckets.push(b)
  }
  const groups = [...by.values()]
  return groups.length > 0 ? groups : null
}
