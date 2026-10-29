export function createBoundedStream(
  body: ReadableStream<Uint8Array>,
  expMs: number,
  ac: AbortController,
) {
  const reader = body.getReader()
  let timer: ReturnType<typeof setTimeout> | undefined
  const rem = Math.max(0, expMs - Date.now())
  const stop = () => {
    clearTimeout(timer)
    ac.abort()
    return reader.cancel().catch(() => {})
  }
  return new ReadableStream<Uint8Array>({
    start(ctrl) {
      ctrl.enqueue(new TextEncoder().encode('retry: 3000\n\n'))
      timer = setTimeout(() => {
        stop()
        try {
          ctrl.close()
        } catch {}
      }, rem)
    },
    async pull(ctrl) {
      if (Date.now() >= expMs) {
        await stop()
        ctrl.close()
        return
      }
      const { done, value } = await reader.read()
      if (done) {
        clearTimeout(timer)
        ctrl.close()
      } else {
        ctrl.enqueue(value)
      }
    },
    cancel: () => stop(),
  })
}
