import { execFileSync } from 'node:child_process'
import { scan } from './scan-lines.mjs'
import { GATED } from './patterns.mjs'

const log = execFileSync('git', ['log', '--all', '-p', '--format=__COMMIT__%h'], {
  encoding: 'utf8',
  maxBuffer: 1 << 29,
})
const hits = scan(log)
let failed = false
for (const [key, count] of [...hits].sort()) {
  const [id, file] = key.split('\t')
  console.log(`${id}\t${count}\t${file}`)
  if (GATED.has(id)) failed = true
}
console.log(`scanned ${log.split('__COMMIT__').length - 1} commits; ${hits.size} findings`)
process.exit(failed ? 1 : 0)
