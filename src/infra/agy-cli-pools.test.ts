import test from'node:test'
import assert from'node:assert/strict'
import{cliPoolFamilies}from'./agy-cli-pools.js'
test('cli pool maps contract labels, unknown stays unknown',()=>{
 assert.deepEqual(cliPoolFamilies('Gemini Models'),['gemini'])
 assert.deepEqual(cliPoolFamilies('Claude and GPT models'),['claude','gpt'])
 assert.deepEqual(cliPoolFamilies('GEMINI 4 ARGON'),['argon'])
 assert.equal(cliPoolFamilies('mystery-pool'),null)
 process.env.BISEO_AGY_CLI_POOLS='{"my pool":["gpt"]}'
 assert.deepEqual(cliPoolFamilies('my pool'),['gpt'])
 delete process.env.BISEO_AGY_CLI_POOLS
})
