import r from '../resources.json'
import { Button } from '../components/ui/button'
export function JumpToBottomButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="pill"
      onClick={onClick}
      aria-label={r.jumpToNew}
      className="absolute bottom-3 left-1/2 z-5 -translate-x-1/2 bg-primary text-white shadow-lg"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
      <span>{r.jumpToNew}</span>
    </Button>
  )
}
