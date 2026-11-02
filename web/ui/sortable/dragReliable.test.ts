import test from 'node:test'
import assert from 'node:assert/strict'
import { createDragBench } from './dragBenchServer'
import { runMouseDrag } from './dragMouse'
import { runTouchDrag } from './dragTouch'

test('drag reliability: 20 mouse and 20 touch drags under polling succeed', async () => {
  const bench = await createDragBench()
  try {
    let mouseSuccess = 0
    for (let i = 0; i < 20; i++) {
      if (await runMouseDrag(bench.page)) mouseSuccess++
    }
    assert.equal(mouseSuccess, 20)

    let touchSuccess = 0
    for (let i = 0; i < 20; i++) {
      if (await runTouchDrag(bench.page)) touchSuccess++
    }
    assert.equal(touchSuccess, 20)
  } finally {
    await bench.cleanup()
  }
})
