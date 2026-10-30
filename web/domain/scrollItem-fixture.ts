import type { TimelineItem } from './timeline-item'

/** 스크롤 정책 테스트용 타임라인 항목(ownSend 선택). */
export const scrollItem = (
  requestId: string,
  status: TimelineItem['status'] = 'queued',
  ownSend = false,
): TimelineItem => ({
  requestId, workspaceId: 'w1', paneId: 'p1', targetName: 'T1',
  promptText: 'hi', status, createdAt: '2026-10-30T00:00:00Z', ownSend,
})
