import { Card } from '../components/ui/card'
import { Search } from 'lucide-react'

export function HistoryView() {
  return (
    <Card className="rounded-md bg-surface p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-card">
        <Search size={18} className="text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          placeholder="로그 검색 (0.3.2 예정)..."
          disabled
          className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        이력 및 검색 기능은 0.3.2 마일스톤에서 지원될 예정입니다.
      </p>
    </Card>
  )
}
