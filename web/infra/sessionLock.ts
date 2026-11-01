let pending: Promise<void> | undefined

export function sessionLock<T>(run: () => Promise<T>): Promise<T> {
 if (!globalThis.navigator?.locks) return Promise.reject(new Error('session lock unavailable'))
 return navigator.locks.request('biseo-session', run)
}
export function singleRefresh(run: () => Promise<void>) {
 if (!pending) pending = sessionLock(run).finally(() => { pending = undefined })
 return pending
}
