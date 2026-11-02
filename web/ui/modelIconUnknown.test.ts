import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{PaneMeta}from'./PaneMeta'
import{metaPane}from'./paneMetaFixture.test-util'

test('unknown model family uses a neutral icon and initial matching copy',()=>{
 const beam=renderToStaticMarkup(createElement(PaneMeta,{item:metaPane('beam','opencode')}))
 assert.match(beam,/beam/)
 assert.match(beam,/lucide-bot/)
 const none=renderToStaticMarkup(createElement(PaneMeta,{item:metaPane(null)}))
  assert.match(none,/확인 중/)
  assert.doesNotMatch(none,/모델 미확인/)
 assert.match(none,/lucide-bot/)
})
