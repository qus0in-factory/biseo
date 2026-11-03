export function px(value: string) {
  const n = parseFloat(value)
  return value.endsWith('rem') ? n * 16 : n
}

export function sides(value: string) {
  const s = value.trim().split(/\s+/).map(px)
  return [s[0], s[1] ?? s[0], s[2] ?? s[0], s[3] ?? s[1] ?? s[0]]
}

export function contrast(a: string, b: string) {
  const l = (h: string) => {
    const [r, g, bl] = rgb(h).map((c) =>
      c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
    )
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [x, y] = [l(a), l(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

function rgb(h: string) {
  const s = h.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255)
}
