import test from 'node:test'
import assert from 'node:assert/strict'
import { HerdrCli } from './herdr-cli.js'
import { expectedRead, expectedSendKeys, mkBin, readArgs, rmBin, scriptRead } from './herdr-cli-fixture.js'

test('sends allowlisted keys and reads only recent plain-text lines', async () => {
  const { dir, bin, args } = mkBin(scriptRead)
  const old = [process.env.HERDR_BIN_PATH, process.env.ARGS_FILE]
  process.env.HERDR_BIN_PATH = bin
  process.env.ARGS_FILE = args
  try {
    await new HerdrCli().sendKeys('w:p1', 'esc')
    assert.deepEqual(readArgs(args), expectedSendKeys)
    const lines = await new HerdrCli().readRecent('w:p1', 8)
    assert.deepEqual(lines, ['one', 'two'])
    assert.deepEqual(readArgs(args), expectedRead)
  } finally {
    if (old[0] === undefined) delete process.env.HERDR_BIN_PATH
    else process.env.HERDR_BIN_PATH = old[0]
    if (old[1] === undefined) delete process.env.ARGS_FILE
    else process.env.ARGS_FILE = old[1]
    rmBin(dir)
  }
})
