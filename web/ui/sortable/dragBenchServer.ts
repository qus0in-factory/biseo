import { createServer } from 'vite'
import { chromium } from 'playwright'

export async function createDragBench() {
  const server = await createServer({
    root: 'web',
    server: { port: 5198 },
    logLevel: 'error',
  })
  await server.listen()
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ hasTouch: true })
  await page.goto('http://localhost:5198/drag-bench.html')
  await page.waitForSelector('#order-ids')
  return {
    page,
    cleanup: async () => {
      await browser.close()
      await server.close()
    },
  }
}
