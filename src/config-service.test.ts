import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { servicePublicKeyPath } from './config-service.js'

test('missing public key path defaults to cwd config/service-public.key', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'svc-key-'))
  assert.equal(servicePublicKeyPath('', '', cwd), join(cwd, 'config', 'service-public.key'))
  assert.equal(servicePublicKeyPath('  ', '', cwd), join(cwd, 'config', 'service-public.key'))
  assert.equal(servicePublicKeyPath('keys/pub.pem', undefined, cwd), 'keys/pub.pem')
  assert.equal(servicePublicKeyPath(undefined, 'config/from-file.key', cwd), 'config/from-file.key')
})
