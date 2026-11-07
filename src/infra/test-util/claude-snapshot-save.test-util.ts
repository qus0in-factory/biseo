import { good, chk } from './claude-cache-fixture.test-util.js'
import { resolveClaude } from '../claude-snapshot-store.js'

resolveClaude(new Date(chk), good)
