export function sessionTestEnv() {
 const original = Object.getOwnPropertyDescriptor(globalThis,'navigator')
 let tail: Promise<unknown> = Promise.resolve()
 const locks = { request: (_: string, fn: () => Promise<unknown>) => {
  const task = tail.then(fn)
  tail = task.catch(() => {})
  return task
 } }
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{locks}})
 const target = new EventTarget()
 Object.assign(globalThis,{window:target,localStorage:{setItem(){}}})
 const fetch = globalThis.fetch
 return { target, restore() {
  globalThis.fetch = fetch
  if (original) Object.defineProperty(globalThis,'navigator',original)
 } }
}
