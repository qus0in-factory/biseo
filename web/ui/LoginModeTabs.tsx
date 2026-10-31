import r from '../resources.json'

export function LoginModeTabs({
  pinMode,
  onChange,
}: {
  pinMode: boolean
  onChange: (pin: boolean) => void
}) {
  return (
    <div className="flex gap-3 text-sm">
      <button
        type="button"
        className={pinMode ? 'text-muted-foreground' : 'font-semibold'}
        aria-pressed={!pinMode}
        onClick={() => onChange(false)}
      >
        {r.passwordLogin}
      </button>
      <button
        type="button"
        className={pinMode ? 'font-semibold' : 'text-muted-foreground'}
        aria-pressed={pinMode}
        onClick={() => onChange(true)}
      >
        {r.pinLogin}
      </button>
    </div>
  )
}
