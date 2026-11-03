import { useContext } from 'react'
import { UsagePaceDisplay } from './UsagePaceDisplay'
import { UsagePaceSettingRow } from './UsagePaceSettingRow'
import r from '../resources.json'

const rows = [
  { kind: 'w' as const, label: r.usagePaceWeek },
  { kind: 'm' as const, label: r.usagePaceMonth },
]

export function UsagePaceSettings() {
  const { settings, toggle } = useContext(UsagePaceDisplay)
  return (
    <div className="mt-2 border-t border-border pt-2">
      <p className="text-xs font-medium">{r.usagePaceSettings}</p>
      <p className="text-xs text-muted-foreground">{r.usagePaceSettingsHint}</p>
      {rows.map(({ kind, label }) => (
        <UsagePaceSettingRow key={kind} label={label} on={settings[kind]}
          ariaLabel={`${r.usagePaceSettings}: ${label}`} onToggle={() => toggle(kind)} />
      ))}
    </div>
  )
}
