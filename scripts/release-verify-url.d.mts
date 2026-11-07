export const ENV_KEY: string
export const missingUrlHint: string
export function customDomainUrl(wrangler: unknown): string | undefined
export function resolveVerifyUrl(input: {
  env?: Record<string, string | undefined>
  fileUrl?: string
  wranglerText?: string
}): string | undefined
export function loadVerifyUrl(
  fileUrl: string | undefined,
  wranglerPath: URL | string,
  env?: Record<string, string | undefined>,
): Promise<string | undefined>
