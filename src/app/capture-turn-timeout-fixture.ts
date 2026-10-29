import { setup } from './run-fixture.js'

export const timeoutCase = () => {
  const s = setup()
  s.d.timeoutMs = 1
  s.d.lateCaptureMs = 200
  const ms: number[] = []
  let n = 0
  return {
    s,
    ms,
    read: async (tt: number) => {
      ms.push(tt)
      n++
      if (n === 1) return null
      await new Promise((r) => setTimeout(r, 5))
      return 'late'
    },
  }
}
