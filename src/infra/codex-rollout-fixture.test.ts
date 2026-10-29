import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
export const id = '11111111-2222-4333-8444-555555555555'
async function fixture(lines: string[]) {
  const dir = await mkdtemp(join(tmpdir(), 'biseo-av-'))
  const sub = join(dir, '2026', '10', '29')
  await mkdir(sub, { recursive: true })
  await writeFile(join(sub, `rollout-2026-10-29T10-00-00-${id}.jsonl`), lines.join('\n'))
  return dir
}
export async function withDir(lines: string[], run: () => Promise<void>) {
  const prev = process.env.BISEO_CODEX_DIR
  process.env.BISEO_CODEX_DIR = await fixture(lines)
  try {
    await run()
  } finally {
    if (prev === undefined) delete process.env.BISEO_CODEX_DIR
    else process.env.BISEO_CODEX_DIR = prev
  }
}
