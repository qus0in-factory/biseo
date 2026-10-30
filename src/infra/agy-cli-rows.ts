const head = ['modelbucket', 'limitwindow', 'remaining', 'resettime']

const isHead = (c: string[]): boolean =>
  c.every((v, i) => v.toLowerCase().replace(/[\s_]+/g, '') === head[i])

export function cliRows(out: string): string[][] {
  let rows = out.split(/\r?\n/)
    .map((l) => l.split('\t').map((c) => c.trim()))
    .filter((c) => c.length === 4 && c.some((v) => v))
  if (rows[0] && isHead(rows[0])) rows = rows.slice(1)
  return rows
}
