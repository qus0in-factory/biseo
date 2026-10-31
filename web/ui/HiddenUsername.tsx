export function HiddenUsername() {
  return (
    <input
      type="text"
      name="username"
      autoComplete="username"
      className="hidden"
      tabIndex={-1}
      aria-hidden="true"
      readOnly
      defaultValue=""
    />
  )
}
