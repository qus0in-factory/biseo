export function isLimitMarker(lines: readonly string[], markers: readonly string[]): boolean {
  if (!lines.length || !markers.length) return false
  const text = lines.join('\n').toLowerCase()
  return markers.some((m) => {
    const x = m.trim().toLowerCase()
    return x !== '' && text.includes(x)
  })
}
