import test from'node:test'
import assert from'node:assert/strict'
import{moveUsageId,moveUsageIdTo,reorderUsageIds}from'./usageOrder.js'
test('moveUsageId moves ids and clamps at ends',()=>{assert.deepEqual(moveUsageId(['a','b','c'],'b',-1),['b','a','c']);assert.deepEqual(moveUsageId(['a','b','c'],'c',1),['a','b','c']);assert.deepEqual(moveUsageId(['a','b'],'z',1),['a','b'])})
test('moveUsageIdTo reorders by target index',()=>{assert.deepEqual(moveUsageIdTo(['a','b','c'],'c',0),['c','a','b']);assert.deepEqual(moveUsageIdTo(['a','b','c'],'a',2),['b','c','a']);assert.deepEqual(moveUsageIdTo(['a','b','c'],'z',1),['a','b','c'])})
test('reorderUsageIds moves by from/to index',()=>{assert.deepEqual(reorderUsageIds(['a','b','c'],2,0),['c','a','b']);assert.deepEqual(reorderUsageIds(['a','b','c'],0,2),['b','c','a']);assert.deepEqual(reorderUsageIds(['a','b','c'],5,0),['a','b','c'])})
