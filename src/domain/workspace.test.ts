import test from'node:test'
import assert from'node:assert/strict'
import {workspaceIssue}from'./workspace.js'
test('guards the single workspace and unsafe ids',()=>{
 assert.equal(workspaceIssue(undefined,'w'),'workspace_not_configured')
 assert.equal(workspaceIssue('w','w'),null)
 assert.equal(workspaceIssue('w','x'),'workspace_not_allowed')
 assert.equal(workspaceIssue('w','--x'),'workspace_not_allowed')
})
