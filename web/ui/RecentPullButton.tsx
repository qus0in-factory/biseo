import { Download } from 'lucide-react'
import type { RecentPull } from './useRecentPull'
import { Button } from '../components/ui/button'
import resources from '../resources.json'

export function RecentPullButton({ pull }: { pull: RecentPull }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-11 w-11 shrink-0 rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      disabled={pull.isPending}
      onClick={() => pull.mutate()}
      aria-label={resources.recentPull}
      title={resources.recentPull}
    >
      <Download size={18} aria-hidden="true" />
    </Button>
  )
}
