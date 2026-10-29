export function nextOpen(open: boolean, down: boolean | null): boolean | null {
  if (down === null) return !open
  if (down) return null
  return true
}
