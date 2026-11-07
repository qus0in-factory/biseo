import { formatZoned } from '../domain/formatZoned'
import r from '../resources.json'

export function AppFooter() {
  const at = formatZoned(__BUILD_TIME__, r.displayTimeZone)
  return (
    <footer data-app-version={__APP_VERSION_MARK__} className="mt-6 flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-border pt-3 pb-[env(safe-area-inset-bottom)] text-xs text-muted-foreground">
      <span>{r.versionPrefix}{__APP_VERSION__}</span>
      <span>
        {r.lastUpdated} <time dateTime={__BUILD_TIME__}>{at} ({r.displayTimeZoneLabel})</time>
      </span>
    </footer>
  )
}
