import { PATTERNS } from './patterns.mjs'

const bump = (hits, id, file) => {
  const key = `${id}\t${file}`
  hits.set(key, (hits.get(key) ?? 0) + 1)
}

export function scan(log) {
  const hits = new Map()
  let file = ''
  let key = ''
  for (const raw of log.split('\n')) {
    if (raw.startsWith('+++ b/')) {
      file = raw.slice(6)
      continue
    }
    if (!raw.startsWith('+')) continue
    const line = raw.slice(1)
    for (const [id, re] of PATTERNS) if (re.test(line)) bump(hits, id, file)
    if (line.includes('PRIVATE KEY-----')) {
      key = file
      if (/[A-Za-z0-9+/=]{64,}/.test(line)) {
        bump(hits, 'private-key', key)
        key = ''
      }
    } else if (key) {
      if (/^[A-Za-z0-9+/=]{64,}$/.test(line.trim())) bump(hits, 'private-key', key)
      key = ''
    }
  }
  return hits
}
