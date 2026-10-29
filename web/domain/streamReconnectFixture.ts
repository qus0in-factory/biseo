export { makeStreamEnv } from './streamLifecycleEnv.js'

export class FakeEventSource {
  static instances: any[] = []
  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2
  readyState = 0
  closed = false
  onopen: any = null
  onerror: any = null
  ls: Record<string, any[]> = {}
  url: any
  init: any
  constructor(url: any, init?: any) {
    this.url = url
    this.init = init
    FakeEventSource.instances.push(this)
  }
  addEventListener(t: string, cb: any) {
    (this.ls[t] ||= []).push(cb)
  }
  removeEventListener(t: string, cb: any) {
    this.ls[t] = (this.ls[t] || []).filter((x: any) => x !== cb)
  }
  close() {
    this.closed = true
    this.readyState = FakeEventSource.CLOSED
  }
  open() {
    this.readyState = FakeEventSource.OPEN
    this.onopen?.()
  }
  fail() {
    this.onerror?.()
  }
}
