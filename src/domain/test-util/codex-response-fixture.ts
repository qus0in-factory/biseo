export const j = (x: unknown) => JSON.stringify(x)
export const user = (t: string) => j({ type: 'response_item', payload: { type: 'message', role: 'user', content: [{ type: 'input_text', text: t }] } })
export const done = (t: string) => j({ type: 'event_msg', payload: { type: 'task_complete', last_agent_message: t } })