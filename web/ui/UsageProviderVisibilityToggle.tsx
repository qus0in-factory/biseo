import r from '../resources.json'

export function UsageProviderVisibilityToggle({ provider, hidden, onToggle }: {
  provider: string; hidden: boolean; onToggle: () => void
}) {
  return (
    <label className="flex min-h-11 min-w-11 items-center justify-center">
      <input
        type="checkbox"
        checked={!hidden}
        onChange={onToggle}
        aria-label={`${r.usageProviderVisible}: ${provider}`}
        className="size-4 accent-primary"
      />
    </label>
  )
}
