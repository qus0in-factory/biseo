import type { Page } from 'playwright'

export async function runMouseDrag(page: Page) {
  const prev = await page.textContent('#order-ids')
  const item = page.locator('li[role="listitem"]').first()
  const box = await item.boundingBox()
  if (!box) return false
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx, cy + 80, { steps: 5 })
  await page.mouse.up()
  await page.waitForTimeout(50)
  return (await page.textContent('#order-ids')) !== prev
}
