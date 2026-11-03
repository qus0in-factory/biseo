import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{PaneMeta}from'./PaneMeta'
import{metaPane}from'./paneMetaFixture.test-util'

test('known ID with unknown family keeps a neutral icon; missing ID omits model',()=>{
 const beam=renderToStaticMarkup(createElement(PaneMeta,{item:metaPane('beam','opencode')}))
 assert.match(beam,/beam/)
 assert.match(beam,/lucide-bot/)
 const none=renderToStaticMarkup(createElement(PaneMeta,{item:metaPane(null)}))
 assert.equal(none,'')
})
