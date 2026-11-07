export function holdEnv(keys: string[]) {
 const prev = Object.fromEntries(keys.map(k => [k, process.env[k]]))
 return () => {
  for (const k of keys) {
   if (prev[k] === undefined) delete process.env[k]
   else process.env[k] = prev[k]
  }
 }
}
