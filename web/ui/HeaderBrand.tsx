import r from '../resources.json'
import { useUiStore } from '../app/uiStore'

export function HeaderBrand() {
  const id = useUiStore((s) => s.workspaceId)
  const label = useUiStore((s) => s.workspaceLabel)
  const name = label || id
  return (
    <h1 className="flex min-w-0 flex-1 items-center gap-2 text-xl font-semibold leading-[1.25] tracking-tight">
      <img
        src="/favicon.svg"
        alt=""
        aria-hidden="true"
        className="block h-[1.25em] w-[1.25em] shrink-0 object-contain"
      />
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{r.title}</span>
      {name && (
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground" title={name}>
          / {name}
        </span>
      )}
    </h1>
  )
}
