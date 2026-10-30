import { z } from 'zod'

export const paneIdSchema = z.string().trim().min(1).max(64)

export const routeParamsSchema = z.object({
  paneId: paneIdSchema.optional(),
})

export type RouteParams = z.infer<typeof routeParamsSchema>

export const parseRouteParams = (input: unknown): RouteParams => {
  const result = routeParamsSchema.safeParse(input)
  return result.success ? result.data : {}
}
