import { Button } from '../components/ui/button'
import r from '../resources.json'

export function LoginModeTabs({
  pinMode,
  onChange,
}: {
  pinMode: boolean
  onChange: (pin: boolean) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2" role="group">
      <Button
        type="button"
        variant={!pinMode ? 'default' : 'outline'}
        aria-pressed={!pinMode}
        onClick={() => onChange(false)}
      >
        {r.passwordLogin}
      </Button>
      <Button
        type="button"
        variant={pinMode ? 'default' : 'outline'}
        aria-pressed={pinMode}
        onClick={() => onChange(true)}
      >
        {r.pinLogin}
      </Button>
    </div>
  )
}
