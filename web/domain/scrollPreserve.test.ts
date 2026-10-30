import assert from'node:assert/strict'
import test from'node:test'
import{keepScrollTop}from'./scrollPreserve.js'

test('keepScrollTop compensates for items prepended above the viewport',()=>{
 assert.equal(keepScrollTop(1000,0,1200),200)
 assert.equal(keepScrollTop(1000,50,1200),250)
 assert.equal(keepScrollTop(1000,50,1000),50)
})
