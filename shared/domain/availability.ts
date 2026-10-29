export type AvailabilityState='available'|'limited'|'unknown'
export type AvailabilityWindow='primary'|'secondary'
export type Availability={state:AvailabilityState;source:string|null;checkedAt:string|null;observedAt?:string;resetsAt:string|null;reason:string|null;window:AvailabilityWindow|null}
