export interface PaneStatusSummary {
  idle: number
  working: number
  done: number
  blocked: number
  unknown: number
  total: number
}
export type PaneStatusCounts = PaneStatusSummary
export type StatusSummary = PaneStatusSummary
export type PaneStatusCount = PaneStatusSummary
export type StatusCounts = PaneStatusSummary
