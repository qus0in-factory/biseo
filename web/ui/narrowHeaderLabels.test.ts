import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const src = (f: string) => readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')
test('narrow header keeps status and usage labels accessible while hiding text', () => {
 const connection = src('ConnectionStatusBadge.tsx')
 assert.match(connection, /aria-label=\{label\}/)
 assert.match(connection, /<span className="hidden sm:inline">\{label\}<\/span>/)
 const usage = src('UsageButton.tsx')
 assert.match(usage, /aria-label=\{r\.usageTab\}/)
 assert.match(usage, /<span className="hidden sm:inline">\{r\.usageTab\}<\/span>/)
})
