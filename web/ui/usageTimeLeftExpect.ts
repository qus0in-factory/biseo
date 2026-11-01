import assert from 'node:assert/strict'

export function expectTimeIcon(html: string, label: string, percent: number) {
  assert.match(html, /lucide-clock/)
  assert.match(html, new RegExp(`aria-label="${label}"`))
  assert.match(html, new RegExp(`title="${label}"`))
  assert.doesNotMatch(html, new RegExp(`>${label}`))
  assert.match(html, /inline-flex items-center gap-1 text-muted-foreground/)
  assert.match(html, /<span aria-hidden="true">·<\/span>/)
  assert.match(html, /text-xs leading-none/)
  assert.match(html, new RegExp(`${percent}%`))
}

export function expectNoTimeIcon(html: string, label: string) {
  assert.doesNotMatch(html, new RegExp(`aria-label="${label}"`))
  assert.doesNotMatch(html, new RegExp(`>${label}`))
}
