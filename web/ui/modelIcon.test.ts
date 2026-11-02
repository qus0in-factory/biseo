import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{PaneMeta}from'./PaneMeta'
import{metaPane}from'./paneMetaFixture.test-util'

test('panel meta shows model name and family icon instead of runtime tool',()=>{
 const out=renderToStaticMarkup(createElement(PaneMeta,{item:metaPane('gpt-5.2','openai')}))
 assert.match(out,/gpt-5\.2/)
 assert.match(out,/<title>OpenAI<\/title>/)
 assert.doesNotMatch(out,/opencode/)
 assert.match(out,/fill="currentColor"/)
 assert.match(out,/text-muted-foreground/)
})
