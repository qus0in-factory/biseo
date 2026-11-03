import { TabsContent } from '../components/ui/tabs'
import { UsageGrid } from './UsageGrid'
import { UsagePanelRow } from './UsagePanelRow'
import type { UsageProvider } from '../domain/usage'
import r from '../resources.json'

export function UsageTabContent({
  providers,
  bookmarks,
  remaining,
}: {
  providers: UsageProvider[]
  bookmarks: string[]
  remaining: boolean
}) {
  const bookmarked = providers.filter((p) => bookmarks.includes(p.provider))
  return (
    <>
      <TabsContent value="bookmarked">
        {bookmarked.length === 0 ? (
          <p className="text-sm text-muted-foreground">{r.usageBookmarkEmpty}</p>
        ) : (
          <UsageGrid>
            {bookmarked.map((p) => <UsagePanelRow key={p.provider} provider={p} remaining={remaining} summary />)}
          </UsageGrid>
        )}
      </TabsContent>
      {providers.map((p) => (
        <TabsContent key={p.provider} value={p.provider}>
          <UsagePanelRow provider={p} remaining={remaining} />
        </TabsContent>
      ))}
    </>
  )
}
