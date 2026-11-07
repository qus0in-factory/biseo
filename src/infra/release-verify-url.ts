// Resolves the release-verify target url: env > config file key > wrangler custom domain.
import { loadPublicBaseUrl, publicBaseUrl } from './wrangler-public-url.js'

export const ENV_KEY = 'RELEASE_VERIFY_URL'
export const missingUrlHint = `release-verify: url not found; set ${ENV_KEY}=https://<host>`

type Env = Record<string, string | undefined>

export const resolveVerifyUrl = (
  input: { env?: Env; fileUrl?: string; wranglerText?: string },
): string | undefined => {
  const { env = {}, fileUrl, wranglerText } = input
  if (env[ENV_KEY]) return env[ENV_KEY]
  if (fileUrl) return fileUrl
  return wranglerText === undefined ? undefined : publicBaseUrl(wranglerText)
}

export const loadVerifyUrl = async (
  fileUrl: string | undefined, wranglerPath: URL | string, env: Env = process.env,
): Promise<string | undefined> => {
  if (env[ENV_KEY]) return env[ENV_KEY]
  if (fileUrl) return fileUrl
  return loadPublicBaseUrl(wranglerPath)
}
