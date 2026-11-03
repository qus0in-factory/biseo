export const ZERO_SHOT_PROMPT = '1+1은 무엇인가요?'
export const ZERO_SHOT_REPLY = '1+1은 **2**입니다.'

export const ZERO_SHOT_RECORDS_JSONL = [
  JSON.stringify({
    type: 'USER_INPUT',
    source: 'USER_EXPLICIT',
    status: 'DONE',
    content: `<USER_REQUEST>\n${ZERO_SHOT_PROMPT}\n</USER_REQUEST>\n<ADDITIONAL_METADATA>\nThe current local time is: 2026-01-01T00:00:00Z.\n</ADDITIONAL_METADATA>`,
  }),
  JSON.stringify({
    type: 'PLANNER_RESPONSE',
    source: 'MODEL',
    status: 'DONE',
    content: ZERO_SHOT_REPLY,
  }),
].join('\n')
