import test from 'node:test'
import assert from 'node:assert/strict'
import { appendFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createCapture } from './transcript-capture.js'

test('captures a response appended after begin', async () => {
  const base = await mkdtemp(join(tmpdir(), 'biseo-')), cwd = '/tmp/x', dir = join(base, '-tmp-x')
  await mkdir(dir)
  process.env.BISEO_CLAUDE_DIR = base
  try {
    const reader = await createCapture().begin({ source: 'herdr:claude', agent: 'claude', kind: 'id', value: 's1' }, cwd, 'hi')
    assert.ok(reader)
    await appendFile(join(dir, 's1.jsonl'), [
      JSON.stringify({ type: 'user', message: { content: 'hi' } }),
      JSON.stringify({ type: 'assistant', message: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'done' }] } }),
    ].join('\n') + '\n')
    assert.equal(await reader.read(1000), 'done')
  } finally {
    delete process.env.BISEO_CLAUDE_DIR
    await rm(base, { recursive: true, force: true })
  }
})

test('captures an antigravity response appended after begin', async () => {
  const base = await mkdtemp(join(tmpdir(), 'biseo-')), dir = join(base, 's1', '.system_generated', 'logs')
  await mkdir(dir, { recursive: true })
  process.env.BISEO_ANTIGRAVITY_DIR = base
  try {
    const reader = await createCapture().begin({ source: 'herdr:antigravity_cli', agent: 'agy', kind: 'id', value: 's1' }, '/tmp', 'hi')
    assert.ok(reader)
    await appendFile(join(dir, 'transcript_full.jsonl'), [
      JSON.stringify({ type: 'USER_INPUT', source: 'USER_EXPLICIT', content: 'hi' }),
      JSON.stringify({ type: 'PLANNER_RESPONSE', content: 'done', tool_calls: [] }),
    ].join('\n') + '\n')
    assert.equal(await reader.read(1000), 'done')
  } finally {
    delete process.env.BISEO_ANTIGRAVITY_DIR
    await rm(base, { recursive: true, force: true })
  }
})

test('begin exposes transcript input confirmation', async () => {
  const base = await mkdtemp(join(tmpdir(), 'biseo-')), cwd = '/tmp/x', dir = join(base, '-tmp-x')
  await mkdir(dir)
  process.env.BISEO_CLAUDE_DIR = base
  try {
    const r = await createCapture().begin({ source: 'herdr:claude', agent: 'claude', kind: 'id', value: 's1' }, cwd, 'hi')
    assert.ok(r?.confirm)
    assert.equal(await r!.confirm!(), false)
    await appendFile(join(dir, 's1.jsonl'), JSON.stringify({ type: 'user', message: { content: 'hi' } }) + '\n')
    assert.equal(await r!.confirm!(), true)
  } finally {
    delete process.env.BISEO_CLAUDE_DIR
    await rm(base, { recursive: true, force: true })
  }
})

test('unsupported session returns no reader', async () => {
  assert.equal(await createCapture().begin({ source: 'herdr:codex', agent: 'codex', kind: 'id', value: 's' }, '/tmp', 'hi'), null)
})
