import assert from 'node:assert/strict'
import test from 'node:test'

function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function contrast(fg: string, bg: string): number {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const hi = Math.max(l1, l2)
  const lo = Math.min(l1, l2)
  return (hi + 0.05) / (lo + 0.05)
}

test('dark mode text and surface pairs meet WCAG thresholds', () => {
  const dark = {
    background: '#08090a',
    foreground: '#f4f7f5',
    card: '#222823',
    cardForeground: '#f4f7f5',
    secondary: '#222823',
    secondaryForeground: '#f4f7f5',
    muted: '#222823',
    mutedForeground: '#a7a2a9',
    surface: '#222823',
    border: '#a7a2a9',
    success: '#15803d',
    danger: '#b91c1c',
  }

  assert.ok(contrast(dark.foreground, dark.background) >= 4.5)
  assert.ok(contrast(dark.cardForeground, dark.card) >= 4.5)
  assert.ok(contrast(dark.secondaryForeground, dark.secondary) >= 4.5)
  assert.ok(contrast(dark.mutedForeground, dark.muted) >= 4.5)
  assert.ok(contrast(dark.foreground, dark.surface) >= 4.5)
  assert.ok(contrast(dark.mutedForeground, dark.surface) >= 4.5)
  assert.ok(contrast(dark.border, dark.background) >= 3)
  assert.ok(contrast('#f4f7f5', dark.success) >= 4.5)
  assert.ok(contrast('#f4f7f5', dark.danger) >= 4.5)
})

test('light mode text and surface pairs meet WCAG thresholds', () => {
  const light = {
    background: '#f4f7f5',
    foreground: '#08090a',
    surface: '#f4f7f5',
    secondary: '#575a5e',
    muted: '#e2e6e3',
    mutedForeground: '#575a5e',
    border: '#575a5e',
  }

  assert.ok(contrast(light.foreground, light.background) >= 4.5)
  assert.ok(contrast(light.secondary, light.surface) >= 4.5)
  assert.ok(contrast(light.mutedForeground, light.muted) >= 4.5)
  assert.ok(contrast(light.border, light.surface) >= 3)
})
