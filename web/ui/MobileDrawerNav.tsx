import type { TabName } from '../domain/schemas/routeParams'

export function MobileDrawerNav({ onNav }: { onNav: (t: TabName) => void }) {
  const items: [TabName, string][] = [
    ['panels', '패널 목록'],
    ['chat', '채팅 타임라인'],
  ]
  return (
    <nav className="flex flex-col gap-1 pt-2">
      {items.map(([t, label]) => (
        <button
          key={t}
          type="button"
          onClick={() => onNav(t)}
          className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium hover:bg-muted"
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
