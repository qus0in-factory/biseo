// Limit Window label mapping. Defaults cover the CLI contract labels
// (Weekly/Five Hour Limit Remaining); markers are env-overridable.
const marks = (v: string | undefined, d: string): string[] =>
  String(v ?? d).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)

export function cliWindow(w: string): string {
  const e = process.env
  const v = w.toLowerCase().replace(/[-_]+/g, ' ')
  if (marks(e.BISEO_AGY_CLI_5H, '5h,5 hour,five hour').some((m) => v.includes(m))) return '5h'
  if (marks(e.BISEO_AGY_CLI_WEEKLY, 'week').some((m) => v.includes(m))) return 'weekly'
  return w.trim()
}
