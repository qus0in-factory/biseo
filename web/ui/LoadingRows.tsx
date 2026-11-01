export function LoadingRows({ rows = 3, login = false }: { rows?: number; login?: boolean }) {
  const base = login ? 'rounded-sm bg-muted' : 'rounded-md bg-muted'
  const shape = (i: number) => (login ? `${i ? 'h-11' : 'h-4 w-20'} ${base}` : `h-10 ${base}`)
  return (
    <div aria-hidden="true" className={`flex flex-col ${login ? 'gap-3' : 'gap-2'}`}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={`${shape(i)} animate-pulse motion-reduce:animate-none`} />
      ))}
    </div>
  )
}
