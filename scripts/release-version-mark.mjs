// Matches the build-time app version marker (e.g. "app-version:0.6.0"), not any bare version string.
export const hasVersionMark = (js, prefix, version) =>
  js.includes(`"${prefix}${version}"`) || js.includes(`'${prefix}${version}'`) || js.includes(`\`${prefix}${version}\``)

export const makeGet = (url, timeoutMs) => async (path) => {
  const res = await fetch(new URL(path, url), { signal: AbortSignal.timeout(timeoutMs) })
  if (!res.ok) throw new Error(`${path} -> ${res.status}`)
  return res.text()
}

// True when any script bundle linked from / carries the version mark.
export const bundleHasMark = async (get, prefix, version) => {
  const html = await get('/')
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1])
  if (!assets.length) throw new Error('no script bundle found in /')
  for (const a of assets) if (hasVersionMark(await get(a), prefix, version)) return true
  return false
}
