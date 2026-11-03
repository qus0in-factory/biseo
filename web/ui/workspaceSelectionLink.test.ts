import test from 'node:test'
import assert from 'node:assert/strict'
import type { WorkspaceApiPort } from '../domain/ports'
import { linkWorkspaceSelector } from './workspaceSelectionLink'
import { resolveWorkspaceSelector } from './workspaceSelectionLink'
import type { WorkspaceSelector } from './workspaceSelectionLink'

const port={}as WorkspaceApiPort
const first:WorkspaceSelector=async()=>null
const second:WorkspaceSelector=async()=>({workspaceId:'w2'})

test('newest selector wins over old cleanup',()=>{
 const unlinkFirst=linkWorkspaceSelector(first)
 assert.equal(resolveWorkspaceSelector(port),first)
 const unlinkSecond=linkWorkspaceSelector(second)
 unlinkFirst()
 assert.equal(resolveWorkspaceSelector(port),second)
 unlinkSecond()
 assert.equal(resolveWorkspaceSelector(port),null)
})

test('an unlinked port keeps its own selection api',async()=>{
 const api={selectWorkspace:async(id:string)=>({workspaceId:id})}as WorkspaceApiPort
 const select=resolveWorkspaceSelector(api)
 assert.ok(select)
 assert.deepEqual(await select('w1'),{workspaceId:'w1'})
})

test('port without selection support has no selector',()=>{
 assert.equal(resolveWorkspaceSelector(port),null)
})
