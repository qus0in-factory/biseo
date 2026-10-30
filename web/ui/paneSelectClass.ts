export const paneSelectClass = (active: boolean) =>
  `flex h-16 min-h-16 w-full min-w-0 cursor-pointer flex-col justify-center gap-1 overflow-hidden rounded-sm border p-2 px-3 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${active ? 'border-primary bg-primary/15' : 'border-border bg-surface'}`
