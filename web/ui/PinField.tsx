import r from '../resources.json'

export function PinField({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  return (
    <label className="flex flex-col gap-1.5 font-medium">
      {r.pinLabel}
      <input
        className="box-border min-h-11 w-full rounded-sm border border-border bg-transparent px-3 py-2 tracking-[0.4em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        type="password"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        disabled={disabled}
      />
    </label>
  )
}
