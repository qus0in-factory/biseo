import test from'node:test'
import assert from'node:assert/strict'
import {mkdtempSync,rmSync}from'node:fs'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {readSelectedWorkspace,writeSelectedWorkspace}from'./workspace-selection.js'
test('selection persists and reloads',()=>{
 const dir=mkdtempSync(join(tmpdir(),'ws-'))
 const f=join(dir,'sel.json')
 writeSelectedWorkspace('w2',f)
 assert.equal(readSelectedWorkspace(f),'w2')
 rmSync(dir,{recursive:true,force:true})
})
test('invalid selection is rejected',()=>{
 assert.throws(()=>writeSelectedWorkspace('bad id'))
})
