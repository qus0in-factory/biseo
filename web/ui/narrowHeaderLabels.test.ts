import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')
test('narrow header keeps connection text and usage label accessible', () => {
 const connection = src('ConnectionStatusBadge.tsx')
 assert.match(connection, /aria-label=\{label\}/)
 assert.match(connection, /<span>\{label\}<\/span>/)
 const usage = src('UsageButton.tsx')
 assert.match(usage, /aria-label=\{r\.usageTab\}/)
 assert.match(usage, /<span className="hidden sm:inline">\{r\.usageTab\}<\/span>/)
})
