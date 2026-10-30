import assert from'node:assert/strict'
import test from'node:test'
import{canLoadOlder}from'./timelinePaging.js'

test('canLoadOlder blocks the end, loading, null and duplicate cursors',()=>{
 const p={items:[],hasMore:true,before:5}
 assert.equal(canLoadOlder(p,false,null),true)
 assert.equal(canLoadOlder({...p,hasMore:false},false,null),false)
 assert.equal(canLoadOlder(p,true,null),false)
 assert.equal(canLoadOlder({...p,before:null},false,null),false)
 assert.equal(canLoadOlder(p,false,5),false)
})
