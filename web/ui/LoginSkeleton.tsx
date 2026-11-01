import r from '../resources.json'

export function LoginSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label={r.loading}
      role="status"
      className="mx-auto flex w-full max-w-[360px] flex-col gap-3"
    >
      <div className="h-4 w-20 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
      <div className="h-11 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
      <div className="h-11 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
    </div>
  )
}
