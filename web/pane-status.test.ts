import test from 'node:test'
import assert from 'node:assert/strict'
import { read } from './test-util/paneCss'
import { vars } from './test-util/paneCss'
import { rule } from './test-util/paneCss'
import { resolve } from './test-util/paneCss'
import { contrast } from './test-util/paneColor'

const v = vars(read('theme.css'))
const css = read('pane-status.css')
const names = ['idle', 'working', 'done', 'blocked', 'unknown']
const rules = names.map((s) => rule(css, `.pane-badge.status-${s}`))
const val = (r: Record<string, string>, k: string) => resolve(r[k], v)

test('status text and boundaries meet WCAG contrast', () => {
  for (const [i, r] of rules.entries()) {
    const bg = val(r, 'background')
    assert.ok(!JSON.stringify(r).includes('#'), `${names[i]} must use tokens`)
    assert.ok(contrast(bg === 'transparent' ? '#FFFFFF' : bg, val(r, 'color')) >= 4.5)
    const edge =
      bg === 'transparent' || bg === '#F4F7F5'
        ? val(r, 'border').match(/#[0-9A-Fa-f]{6}/)![0]
        : bg
    assert.ok(contrast('#FFFFFF', edge) >= 3, `${names[i]} boundary`)
  }
})
{
const v = vars(read('theme.css'))
const css = read('pane-status.css')
const names = ['idle', 'working', 'done', 'blocked', 'unknown']
const [idle, working, done, blocked, unknown] = names.map((s) =>
  rule(css, `.pane-badge.status-${s}`),
)
const val = (r: Record<string, string>, k: string) => resolve(r[k], v)

test('status badges use five distinct design-token treatments', () => {
  const sigs = [idle, working, done, blocked, unknown].map((r) =>
    ['background', 'color', 'border'].map((k) => val(r, k)).join('|'),
  )
  assert.equal(new Set(sigs).size, 5)
  assert.notEqual(val(done, 'background'), val(blocked, 'background'))
  assert.ok(contrast('#FFFFFF', val(working, 'background')) >= 3)
})
}
const B=(c:string,s:string)=>{const i=c.indexOf(`${s} {`);if(i<0)throw Error(s);return c.slice(i+s.length+2).split('}')[0]}
const V=(c:string)=>Object.fromEntries([...c.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]))
const R=(x:string,v:Record<string,string>):string=>x.replace(/var\(--([\w-]+)\)/g,(_,k:string)=>R(v[k]??'',v))
const T={...V(read('theme-tokens.css')),...V(B(read('theme-status.css'),':root'))}
const C=(a:string,b:string)=>contrast(R(T[a],T),R(T[b],T))
test('light status contrast',()=>{for(const p of [['status-idle','color-surface'],['color-canvas','status-working'],['color-canvas','status-done'],['color-canvas','status-blocked'],['status-unknown-fg','color-surface']])assert.ok(C(p[0],p[1])>=4.5)})
