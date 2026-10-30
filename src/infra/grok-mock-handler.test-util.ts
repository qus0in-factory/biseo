export function mockGrokBilling(req: any, res: any, b: { count: number }, r: { count: number }) {
  if (req.url?.includes('/billing')) {
    b.count++
    const ok = req.headers.authorization === 'Bearer fresh'
    res.writeHead(ok ? 200 : 401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(ok ? { creditUsagePercent: 30 } : { error: 'unauth' }))
  } else if (req.url?.includes('/token')) {
    r.count++
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ access_token: 'fresh' }))
  }
}
