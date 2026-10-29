import r from '../resources.json'

export function HeaderBrand() {
  return (
    <h1 className="flex min-w-0 flex-1 items-center gap-2 text-2xl leading-[1.25]">
      <img
        src="/favicon.svg"
        alt=""
        aria-hidden="true"
        className="block h-[1.25em] w-[1.25em] shrink-0 object-contain"
      />
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{r.title}</span>
    </h1>
  )
}
