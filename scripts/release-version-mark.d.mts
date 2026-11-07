export function hasVersionMark(js: string, prefix: string, version: string): boolean
export function makeGet(url: string, timeoutMs: number): (path: string) => Promise<string>
export function bundleHasMark(
  get: (path: string) => Promise<string>,
  prefix: string,
  version: string,
): Promise<boolean>
