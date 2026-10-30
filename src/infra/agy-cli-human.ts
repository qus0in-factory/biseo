import { cliPoolFamilies } from './agy-cli-pools.js'

// Human section: header, description ignored, limit, used, refresh.
const pct = /(\d+(?:\.\d+)?)\s*%/
const dur = /refreshes\s+in\s+(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i

export function cliHumanRows(o: string, n: number): string[][] {
  const r: string[][] = []
  let p = ''
  let w = ''
  let u: number | null = null
  const f = (s: string) => {
    if (p && w && u !== null) r.push([p, w, `${100 - u}%`, s])
    u = null
  }
  for (const l of o.split(/\n/)) {
    const t = l.trim()
    if (!t || t.includes('\t')) continue
    if (cliPoolFamilies(t) && !/limit|%/i.test(t)) {
      f('')
      p = t
      w = ''
      continue
    }
    if (/limit/i.test(t)) {
      f('')
      w = t
      continue
    }
    const d = t.match(dur)
    if (d && (d[1] || d[2])) {
      f(new Date(n + Number(d[1] ?? 0) * 36e5 + Number(d[2] ?? 0) * 6e4).toISOString())
      continue
    }
    const m = t.match(pct)
    if (m && w) u = Number(m[1])
  }
  f('')
  return r
}
