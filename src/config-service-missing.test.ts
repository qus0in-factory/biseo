import test from 'node:test'
import assert from 'node:assert/strict'
import {config} from './config.js'
import {validateBootConfig} from './config-boot.js'
import {missingConfigKeys} from './config-missing.js'

test('missing service identity reports env names only',()=>{
 const c={...config,serviceIssuer:'',serviceAudience:''}
 assert.throws(()=>validateBootConfig(c))
 assert.deepEqual(missingConfigKeys(c),['SERVICE_ISSUER','SERVICE_AUDIENCE'])
})
