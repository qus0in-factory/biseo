export function makeStreamEnv() {
  const winListeners: Record<string, Array<(e?: any) => void>> = {}
  const docListeners: Record<string, Array<(e?: any) => void>> = {}
  const window = {
    addEventListener(type: string, cb: (e?: any) => void) {
      (winListeners[type] ||= []).push(cb)
    },
    removeEventListener(type: string, cb: (e?: any) => void) {
      winListeners[type] = (winListeners[type] || []).filter((x) => x !== cb)
    },
  }
  const document = {
    visibilityState: 'hidden' as string,
    addEventListener(type: string, cb: (e?: any) => void) {
      (docListeners[type] ||= []).push(cb)
    },
    removeEventListener(type: string, cb: (e?: any) => void) {
      docListeners[type] = (docListeners[type] || []).filter((x) => x !== cb)
    },
  }
  return { window, document, winListeners, docListeners }
}
