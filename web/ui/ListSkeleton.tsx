import r from '../resources.json'

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label={r.loading} className="flex flex-col gap-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
      ))}
    </div>
  )
}
