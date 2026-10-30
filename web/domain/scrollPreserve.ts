export const keepScrollTop = (beforeHeight: number, beforeTop: number, afterHeight: number) =>
  Math.max(0, afterHeight - beforeHeight + beforeTop)
