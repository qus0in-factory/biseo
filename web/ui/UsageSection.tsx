import { UsagePanel } from './UsagePanel'
import { useUsageVisibility } from './useUsageVisibility'
import r from '../resources.json'

const res = r as Record<string, string>

export function UsageSection({ enabled = true }: { enabled?: boolean }) {
  const { visible, toggle } = useUsageVisibility()
  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={visible}
        onClick={toggle}
        className="inline-flex min-h-9 items-center justify-center rounded-md border border-border px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {visible ? res.usageHide : res.usageShow}
      </button>
      {visible && <UsagePanel enabled={enabled} />}
    </section>
  )
}
