export type AgyBucket = {
  bucketId?: string
  displayName?: string
  window?: string
  resetTime?: string | null
  remainingFraction?: number
  disabled?: boolean
  modelId?: string
}

export type AgyGroup = {
  displayName: string
  buckets: AgyBucket[]
  // Model family keys detected on the quota model ids of this pool.
  families?: string[]
}
