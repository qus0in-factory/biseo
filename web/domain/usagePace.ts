import type { UsageMetric, UsageWindow } from './usage'

export type UsagePaceKind = 'w' | 'm'
export type UsagePaceSettings = Record<UsagePaceKind, boolean>
export type UsagePaceInput = { label: string; startsAt?: string | null; resetsAt: string | null; remaining: boolean }

export const defaultUsagePace: UsagePaceSettings = { w: true, m: true }

export function parseUsagePace(raw: string | null): UsagePaceSettings {
  if (!raw) return defaultUsagePace
  try {
    const v = JSON.parse(raw) as Partial<UsagePaceSettings>
    return { w: v.w !== false, m: v.m !== false }
  } catch {
    return defaultUsagePace
  }
}

export const serializeUsagePace = (v: UsagePaceSettings): string => JSON.stringify(v)

export const toggleUsagePace = (v: UsagePaceSettings, kind: UsagePaceKind): UsagePaceSettings =>
  ({ ...v, [kind]: !v[kind] })

export const windowPace = (label: string, w: UsageWindow, remaining: boolean): UsagePaceInput =>
  ({ label, startsAt: w.startsAt, resetsAt: w.resetsAt, remaining })

export const metricPace = (label: string | null, m: UsageMetric, remaining: boolean): UsagePaceInput | null =>
  label === null ? null : { label, startsAt: m.startsAt, resetsAt: m.resetsAt, remaining }
