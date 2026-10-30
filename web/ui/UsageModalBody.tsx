import { useState } from 'react'
import { UsageTabs } from './UsageTabs'
import { UsageModeRow } from './UsageModeRow'
import { useUsage } from '../app/useUsage'
import { usageApi } from '../infra/usageApi'
import { useUsageBookmarks } from '../app/useUsageBookmarks'
import { useUsageMode } from '../app/useUsageMode'
export function UsageModalBody({ enabled }: { enabled: boolean }) {
const { providers } = useUsage(usageApi, enabled)
const { bookmarks, toggle } = useUsageBookmarks()
const { remaining, toggle: toggleMode } = useUsageMode()
const [tab, setTab] = useState('bookmarked')
return (<>
<UsageModeRow remaining={remaining} onToggle={toggleMode} />
<UsageTabs providers={providers} bookmarks={bookmarks} onToggleBookmark={toggle} remaining={remaining} tab={tab} onTabChange={setTab} />
</>)
}