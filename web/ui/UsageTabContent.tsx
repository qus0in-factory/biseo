import { TabsContent } from '../components/ui/tabs'
import { UsagePanelRow } from './UsagePanelRow'
import r from '../resources.json'
const res = r as any
export function UsageTabContent({ providers, bookmarks, remaining }: { providers: any[]; bookmarks: string[]; remaining: boolean }) {
  const bookmarked = providers.filter((p: any) => bookmarks.includes(p.provider))
  return (
    <>
      <TabsContent value="bookmarked">
        {bookmarked.length === 0 ? <p className="text-sm text-muted-foreground">{res.usageBookmarkEmpty}</p> : (
          <div className="flex flex-wrap gap-2">{bookmarked.map((p: any) => <UsagePanelRow key={p.provider} provider={p} remaining={remaining} />)}</div>
        )}
      </TabsContent>
      {providers.map((p: any) => (
        <TabsContent key={p.provider} value={p.provider}>
          <UsagePanelRow provider={p} remaining={remaining} />
        </TabsContent>
      ))}
    </>
  )
}