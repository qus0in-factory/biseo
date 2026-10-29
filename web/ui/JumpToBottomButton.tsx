import r from '../resources.json'
export function JumpToBottomButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="btn btn-jump"
      onClick={onClick}
      aria-label={r.jumpToNew}
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
    </button>
  )
}
