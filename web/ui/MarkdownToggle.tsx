import { Button } from '../components/ui/button.js'
import { Eye, Code2 } from 'lucide-react'

export function MarkdownToggle({
  raw,
  onToggle,
}: {
  raw: boolean
  onToggle: () => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="default"
      className="min-h-11 min-w-11 gap-1"
      aria-pressed={!raw}
      onClick={onToggle}
    >
      {raw ? <Eye className="h-4 w-4" aria-hidden="true" /> : <Code2 className="h-4 w-4" aria-hidden="true" />}
      <span>{raw ? '렌더링' : '원본'}</span>
    </Button>
  )
}
