import type { Page } from 'playwright'

export async function runTouchDrag(page: Page) {
  const prev = await page.textContent('#order-ids')
  const item = page.locator('li[role="listitem"]').first()
  const box = await item.boundingBox()
  if (!box) return false
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy }] })
  await page.waitForTimeout(280)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx, y: cy + 80 }] })
  await page.waitForTimeout(30)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await cdp.detach()
  await page.waitForTimeout(50)
  return (await page.textContent('#order-ids')) !== prev
}
