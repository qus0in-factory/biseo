import { registerHooks } from 'node:module'

// SSR does not measure layout. Ignore only CSS imports, not component modules.
export async function importWithoutStyles<T>(load: () => Promise<T>): Promise<T> {
  const hooks = registerHooks({
    load(url, context, next) {
      return url.endsWith('.css')
        ? { format: 'module', source: 'export default ""', shortCircuit: true }
        : next(url, context)
    },
  })
  try { return await load() } finally { hooks.deregister() }
}
