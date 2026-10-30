import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeAgyGroups } from './agy-usage-merge.js'

const g=(n:string,r:number,families?:string[])=>({displayName:n,buckets:[{bucketId:'weekly',remainingFraction:r}],families})

test('a summary pool inherits the detected families',()=>{
const merged=mergeAgyGroups([g('Claude and GPT models',0)],[g('Claude and GPT models',0.3,['claude','gpt'])])
assert.deepEqual(merged[0].families,['claude','gpt'])})

test('a pool without a quota match stays unknown',()=>{
assert.deepEqual(mergeAgyGroups([g('Mystery Pool',0)],[])[0].families,['unknown'])})
