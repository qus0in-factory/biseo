import type { RecentPull } from '../ui/useRecentPull'

// Only the view-consumed mutation fields are faked; no query client or request runs.
export const recentPullFixture = (
  state: 'idle' | 'pending' | 'error' | 'success',
  mutate = () => {},
  pending = state === 'pending',
): RecentPull => ({
  isPending: pending,
  isError: state === 'error',
  isSuccess: state === 'success',
  data: state === 'success' ? { state: 'imported' } : undefined,
  mutate,
}) as unknown as RecentPull
