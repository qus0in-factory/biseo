export const paneSelectClass = (active: boolean) =>
  `relative flex h-16 min-h-16 w-full min-w-0 touch-manipulation flex-col justify-center gap-1 overflow-hidden rounded-sm border border-border p-2 px-3 text-left ${active ? 'bg-primary/15' : 'bg-surface'}`

export const paneSelectTarget = 'absolute inset-0 cursor-pointer rounded-sm outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring'
export const paneSelectRow = 'pointer-events-none relative flex w-full min-w-0 items-center gap-2'
export const paneSelectName = 'min-w-0 flex-1 truncate text-sm'
