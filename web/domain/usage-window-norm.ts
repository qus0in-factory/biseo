export type WarningWindow = '5h' | 'w' | 'm'

export function normalizeWarningWindow(w: string): WarningWindow | null {
  const s = w.toLowerCase().trim()
  if (s === '5h' || s === 'primary' || s.endsWith('-5h') || s === 'five_hour') return '5h'
  if (s === 'w' || s === 'secondary' || s.endsWith('-weekly') || s === 'weekly' || s.startsWith('seven_day')) return 'w'
  if (s === 'm' || s === 'monthly' || s === 'default') return 'm'
  return null
}
