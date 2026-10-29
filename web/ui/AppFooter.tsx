import { formatZoned } from '../domain/formatZoned'
import r from '../resources.json'

export function AppFooter() {
  const at = formatZoned(__BUILD_TIME__, r.displayTimeZone)
  return (
    <footer className="app-footer">
      <span>{r.versionPrefix}{__APP_VERSION__}</span>
      <span>
        {r.lastUpdated} <time dateTime={__BUILD_TIME__}>{at} ({r.displayTimeZoneLabel})</time>
      </span>
    </footer>
  )
}
