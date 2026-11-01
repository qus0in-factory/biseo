import { Loader2 } from 'lucide-react'
import r from '../resources.json'
import { LoadingRows } from './LoadingRows'

type P = { rows?: number; label?: string; variant?: 'list' | 'login' | 'text' | 'inline' }

export function LoadingState({ rows = 3, label = r.loading, variant = 'list' }: P) {
  if (variant === 'inline') return (
    <p role="status" className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
      <Loader2 size={12} className="motion-safe:animate-spin" aria-hidden="true" />
      {label}
    </p>
  )
  const login = variant === 'login'
  const outer = login ? 'mx-auto w-full max-w-[360px]' : variant === 'text' ? '' : 'mt-4'
  return (
    <div role="status" aria-busy="true" aria-label={label} className={`${outer} flex flex-col gap-2`}>
      {variant !== 'text' && <LoadingRows rows={rows} login={login} />}
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function LoginLoading() {
  return <LoadingState variant="login" />
}
