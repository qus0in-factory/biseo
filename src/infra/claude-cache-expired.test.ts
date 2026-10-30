import test from'node:test'
import assert from'node:assert/strict'
import{fetchClaudeUsage}from'./claude-oauth-fetch.js'
import{setLastClaudeSnapshot}from'./claude-snapshot-store.js'
import{good,withCacheEnv}from'./claude-cache-env.test-util.js'
test('an expired cache stays unknown',async()=>{
 await withCacheEnv(async()=>{
  setLastClaudeSnapshot(good,Date.parse('2026-10-30T08:00:00.000Z'))
  const r=await fetchClaudeUsage(new Date('2026-10-30T10:30:00.000Z'))
  assert.equal(r.provider,'claude')
  assert.equal(r.state,'unknown')
  assert.deepEqual(r.metrics,[])})})
