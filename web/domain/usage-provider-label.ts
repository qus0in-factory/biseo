import r from '../resources.json'
export function usageProviderLabel(id: string): string {
  const key = `usageProvider_${id}`
  const label = (r as Record<string, string>)[key]
  return label || id
}
