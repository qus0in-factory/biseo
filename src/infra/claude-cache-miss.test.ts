import test from'node:test'
import assert from'node:assert/strict'
import{fetchClaudeUsage}from'./claude-oauth-fetch.js'
import{withCacheEnv}from'./claude-cache-env.test-util.js'
test('no cache stays an honest unknown',async()=>{
 await withCacheEnv(async()=>{
  const r=await fetchClaudeUsage(new Date('2026-10-30T10:30:00.000Z'))
  assert.equal(r.provider,'claude')
  assert.equal(r.state,'unknown')
  assert.deepEqual(r.metrics,[])
  assert.deepEqual(r.windows,[])})})
