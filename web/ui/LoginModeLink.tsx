import r from '../resources.json'

export function LoginModeLink({ toPin, onClick }: { toPin: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className="self-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
      onClick={onClick}
    >
      {toPin ? r.backToPin : r.forgotPin}
    </button>
  )
}
