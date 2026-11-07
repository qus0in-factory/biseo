// Matches the build-time app version marker (e.g. "app-version:0.6.0"), not any bare version string.
export const hasVersionMark = (js, prefix, version) =>
  js.includes(`"${prefix}${version}"`) || js.includes(`'${prefix}${version}'`) || js.includes(`\`${prefix}${version}\``)

export const makeGet = (url, timeoutMs) => async (path) => {
  const res = await fetch(new URL(path, url), { signal: AbortSignal.timeout(timeoutMs) })
  if (!res.ok) throw new Error(`${path} -> ${res.status}`)
  return res.text()
}
