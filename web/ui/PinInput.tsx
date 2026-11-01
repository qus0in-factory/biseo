import r from '../resources.json'

export function PinInput({
  pin,
  onChange,
  disabled,
  label,
}: {
  pin: string
  onChange: (v: string) => void
  disabled: boolean
  label: string
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium">
      {label}
      <input
        className="min-h-11 w-40 rounded-sm border border-border bg-transparent px-3 tracking-[0.3em]"
        type="password"
        inputMode="numeric"
        autoComplete="new-password"
        maxLength={6}
        value={pin}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        disabled={disabled}
        aria-label={r.pinLabel}
      />
    </label>
  )
}
