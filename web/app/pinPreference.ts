export async function loadPinPreference(
  load: (signal: AbortSignal) => Promise<boolean>,
  timeoutMs: number,
): Promise<boolean> {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<boolean>((resolve) => {
    timer = setTimeout(() => {
      controller.abort()
      resolve(false)
    }, timeoutMs)
  })
  try {
    return await Promise.race([load(controller.signal).catch(() => false), timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}
