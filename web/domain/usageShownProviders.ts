export const shownUsageProviders = <T extends { provider: string }>(
  providers: T[],
  _order: string[],
  hidden: string[],
): T[] => providers.filter((p) => !hidden.includes(p.provider))