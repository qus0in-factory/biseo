import { createScrollHandlers } from './scrollGesture'
import { isNearBottom } from './scrollHelper'
import { shouldResetScroll } from './scrollReset'

type El = HTMLElement | null

export function createBottomReach(
  getEl: () => El,
  onReach?: () => void,
  stopAuto?: (el: HTMLElement) => void,
) {
  let bottom = false
  let auto = false
  let inputTop: number | null = null

  const userInput = () => {
    const el = getEl()
    if (!el) return
    inputTop = el.scrollTop
    if (!auto) return
    auto = false
    bottom = false
    stopAuto?.(el)
  }

  const init = () => {
    bottom = isNearBottom(getEl())
    auto = false
    inputTop = null
  }

  const begin = () => {
    if (!isNearBottom(getEl())) auto = true
  }

  const check = () => {
    const el = getEl()
    const isNear = isNearBottom(el)
    if (inputTop !== null) {
      if (el?.scrollTop === inputTop) return isNear
      inputTop = null
    }
    const wasNear = bottom
    bottom = isNear
    if (shouldResetScroll(wasNear, isNear, auto)) onReach?.()
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight <= 1) auto = false
    return isNear
  }

  return { init, begin, check, handlers: createScrollHandlers(getEl, userInput) }
}
