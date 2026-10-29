import test from 'node:test'
import assert from 'node:assert/strict'
import { HerdrCli } from './herdr-cli.js'
import { mkBin, readArgs, rmBin, scriptEcho } from './herdr-cli-fixture.js'

test('canonical args keep hyphen text positional', async () => {
  const { dir, bin, args } = mkBin(scriptEcho)
  const old = process.env.HERDR_BIN_PATH
  process.env.HERDR_BIN_PATH = bin
  process.env.ARGS_FILE = args
  try {
    for (const text of ['-hello', '--wait']) {
      await new HerdrCli().prompt('w:p1', text, 15000)
      assert.deepEqual(readArgs(args), ['agent', 'prompt', 'w:p1', text])
    }
  } finally {
    if (old === undefined) delete process.env.HERDR_BIN_PATH
    else process.env.HERDR_BIN_PATH = old
    delete process.env.ARGS_FILE
    rmBin(dir)
  }
})
