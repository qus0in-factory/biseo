import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src=(f:string)=>readFileSync(new URL(`./${f}.tsx`,import.meta.url),'utf8')
test('the app frame is a borderless full-width canvas',()=>{
 const frame=src('AppFrame')
 assert.doesNotMatch(frame,/max-w-\[960px\]/)
 assert.doesNotMatch(frame,/border border-border/)
 assert.doesNotMatch(frame,/rounded-lg/)
 assert.match(frame,/w-full[\s\S]*flex-col overflow-hidden/)
})
test('the header ends with one divider and no trailing margin',()=>{
 const header=src('AppHeader')
 assert.match(header,/border-b border-border pb-2/)
 assert.doesNotMatch(header,/mb-4/)
})
