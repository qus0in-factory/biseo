import test from'node:test'
import assert from'node:assert/strict'
import{writeFileSync}from'node:fs'
import{fetchAgyUsage}from'./agy-usage-fetch.js'
import{setAgyCliRun}from'./agy-cli-run.js'
import{agyTestGroup}from'./test-util/agy-test-support.test-util.js'
import{cliTsv,setupCli,doneCli}from'./test-util/agy-cli-scenario.test-util.js'
import { putAgyTokenFile, agyTestEnv, agyQuotaBody, removeAgyTokenFile } from './test-util/agy-test-support.test-util.js'
import { checkAgyScenario } from './test-util/agy-scenario.test-util.js'
import { agyQuotaBody } from './test-util/agy-test-support.test-util.js'

{
test('cli refreshes file, token retry',async()=>{
 const ref={ok:false}
 const calls:string[]=[]
 const ok=(u:string)=>u.includes('token.example')?new Response('no',{status:400}):ref.ok?Response.json({groups:[agyTestGroup],buckets:[]}):new Response('no',{status:401})
 const{p,o}=setupCli('agy-retry','2020-01-01','1',cliTsv,calls,ok)
 setAgyCliRun(async()=>{calls.push('cli');ref.ok=true;writeFileSync(p,JSON.stringify({token:{access_token:'fresh',expiry:'2030-01-01'}}));return cliTsv})
 try{
  const r=await fetchAgyUsage(new Date('2026-10-30'))
  assert.equal(r.state,'available')
  assert.deepEqual(r.metrics.map((m)=>m.used),[0,null])
  assert.equal(calls.length,1)
 }finally{doneCli(p,o)}
})
}
{

test('concurrent callers share a single grant', async () => {
  const p = putAgyTokenFile('agy129-fl', '2020-01-01T00:00:00.000Z')
  agyTestEnv(p)
  const orig = globalThis.fetch
  let grants = 0
  globalThis.fetch = (async (u: string) => {
    if (u.includes('token.example')) { grants += 1; return Response.json({ access_token: 'n', expires_in: 3600 }) }
    return Response.json(agyQuotaBody(u))
  }) as typeof fetch
  try {
    const at = new Date('2026-10-30T12:00:00Z')
    const [a, b] = await Promise.all([fetchAgyUsage(at), fetchAgyUsage(at)])
    assert.deepEqual([a.state, b.state], ['available', 'available'])
    assert.equal(grants, 1)
  } finally { globalThis.fetch = orig; removeAgyTokenFile(p) }
})
}
{

const at = '2026-10-30T12:00:00Z'
const route = async (u: string) => {
  if (u.includes('token.example')) return Response.json({ access_token: 'n' })
  return Response.json(agyQuotaBody(u))
}

test('a refresh without expiry stays usable but is not pinned', async () => {
  await checkAgyScenario('agy129-noexp', '2020-01-01', at, route, async (first, grants) => {
    const later = await fetchAgyUsage(new Date(at))
    assert.deepEqual([first.state, later.state], ['available', 'available'])
    assert.equal(grants.length, 2)
  })
})
}
{

const at = '2026-10-30T12:00:00Z'
const group = { groups: [{ displayName: 'P', buckets: [] }] }
const route = async (u: string, init: RequestInit | undefined, grants: string[]) => {
  if (u.includes('token.example')) return Response.json(grants.length > 1 ? { access_token: 'n2' } : { access_token: 'n1', expires_in: 60, refresh_token: 'next' })
  return Response.json(group)
}

test('a rotated refresh token wins over the stale file', async () => {
  await checkAgyScenario('agy129-rot', '2020-01-01', at, route, async (first, grants) => {
    const later = await fetchAgyUsage(new Date('2026-10-30T12:05:00Z'))
    assert.deepEqual([first.state, later.state], ['available', 'available'])
    assert.equal(grants.length, 2)
    assert.match(grants[1], /refresh_token=next/)
  })
})
}
{

const at = '2026-10-30T12:00:00Z'
const cases: Array<[string, number]> = [['2026-10-30T12:00:30Z', 1], ['2026-10-30T12:05:00Z', 0]]
const route = async (u: string) => {
  if (u.includes('token.example')) return Response.json({ access_token: 'n', expires_in: 3600 })
  return Response.json(agyQuotaBody(u))
}

for (const [expiry, expected] of cases) {
  test(`skew ${expiry} grants ${expected}`, async () => {
    await checkAgyScenario('agy129-skew', expiry, at, route, (res, grants) => {
      assert.equal(res.state, 'available')
      assert.equal(grants.length, expected)
    })
  })
}
}
