export interface AgyMemToken { access: string; expiresAt: number | null }

let mem: AgyMemToken | null = null
let flight: Promise<unknown> | null = null

export const loadAgyMemToken = () => mem

export function storeAgyMemToken(t: AgyMemToken | null): void { mem = t }

export function withAgyFlight<T>(run: () => Promise<T>): Promise<T> {
  if (!flight) {
    const r = run()
    flight = r.finally(() => { flight = null })
    return r
  }
  return flight as Promise<T>
}

export function resetAgyTokenState(): void { mem = null; flight = null }
