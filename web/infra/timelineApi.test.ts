import assert from'node:assert/strict'
import test from'node:test'
import{timelineQuery}from'./timelineApi.js'

test('timeline query carries the pane, three-item page and seq cursor',()=>{
 assert.equal(timelineQuery('w1',{paneId:'w1:p1'}),'workspaceId=w1&limit=3&paneId=w1%3Ap1')
 assert.equal(timelineQuery('w1',{paneId:'w1:p1',before:9,limit:3}),'workspaceId=w1&limit=3&paneId=w1%3Ap1&before=9')
})
