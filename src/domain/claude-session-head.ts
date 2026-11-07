import { closeSync, openSync, readSync } from 'node:fs'
export function claudeSessionHead(file: string): string | null {
  let fd: number | undefined
  try {
    fd = openSync(file, 'r')
    const buf = Buffer.alloc(65536)
    const n = readSync(fd, buf, 0, buf.length, 0)
    return buf.toString('utf8', 0, n)
  } catch { return null } finally { if (fd !== undefined) try { closeSync(fd) } catch { /* closed */ } }
}
