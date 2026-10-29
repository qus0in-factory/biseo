import { z } from 'zod'

export const messageInputSchema = z.object({
  text: z.string().trim().min(1, '메시지를 입력하세요.').max(4000),
})

export type MessageInput = z.infer<typeof messageInputSchema>

export const validateMessageInput = (
  text: string,
): { ok: true; data: MessageInput } | { ok: false; error: string } => {
  const result = messageInputSchema.safeParse({ text })
  if (!result.success) {
    const issue = result.error.issues[0]
    return { ok: false, error: issue?.message ?? '유효하지 않은 입력입니다.' }
  }
  return { ok: true, data: result.data }
}
