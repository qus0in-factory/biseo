// Resolves the release-verify target url: env > config file key > wrangler custom domain.
import { readFile } from 'node:fs/promises'
import { parseJsonc } from './jsonc.mjs'

export const ENV_KEY = 'RELEASE_VERIFY_URL'
export const missingUrlHint = `release-verify: url not found; set ${ENV_KEY}=https://<host>`

export const customDomainUrl = (wrangler) => {
  const route = wrangler?.routes?.[0]
  return route?.custom_domain && route.pattern ? `https://${route.pattern}` : undefined
}

export const resolveVerifyUrl = ({ env = {}, fileUrl, wranglerText }) => {
  if (env[ENV_KEY]) return env[ENV_KEY]
  if (fileUrl) return fileUrl
  return wranglerText ? customDomainUrl(parseJsonc(wranglerText)) : undefined
}

export const loadVerifyUrl = async (fileUrl, wranglerPath, env = process.env) => {
  const wranglerText = await readFile(wranglerPath, 'utf8').catch(() => undefined)
  return resolveVerifyUrl({ env, fileUrl, wranglerText })
}
