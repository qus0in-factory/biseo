export const warningIconClass = (isUnknown: boolean): string =>
  isUnknown
    ? 'inline-flex shrink-0 items-center text-muted-foreground opacity-40'
    : 'inline-flex shrink-0 items-center text-amber-500'
