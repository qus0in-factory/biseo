import type { AgyGroup } from './agy-quota-types.js'
import { modelFamily } from './agy-model-family.js'
import { cliFraction, cliWindow, cliReset } from './agy-cli-fields.js'
import { cliRows } from './agy-cli-rows.js'

export function parseAgyCliTsv(out: string): AgyGroup[] | null {
  const by = new Map<string, AgyGroup>()
  for (const [pool, win, rem, rst] of cliRows(out)) {
    const f = cliFraction(rem ?? '')
    if (!pool || !win || f === null) continue
    const w = cliWindow(win)
    const fam = modelFamily(pool)
    let g = by.get(pool)
    if (!g) {
      g = { displayName: pool, buckets: [], families: [fam] }
      by.set(pool, g)
    } else if (g.families?.[0] === 'unknown' && fam !== 'unknown') {
      g.families = [fam]
    }
    const b = { bucketId: w, displayName: win.trim(), window: w, remainingFraction: f, resetTime: cliReset(rst ?? '') }
    g.buckets.push(b)
  }
  const groups = [...by.values()]
  return groups.length > 0 ? groups : null
}
