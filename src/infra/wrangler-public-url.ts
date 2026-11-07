import { URL as NodeURL } from 'node:url'
import { readFile } from 'node:fs/promises'
import { parseJsonc } from './jsonc.js'

type Route = { pattern?: unknown; custom_domain?: unknown }

export const customDomainUrl = (wrangler: unknown): string | undefined => {
  const routes = (wrangler as { routes?: unknown } | null)?.routes
  const route = Array.isArray(routes) ? (routes[0] as Route | undefined) : undefined
  return route?.custom_domain && typeof route.pattern === 'string' ? `https://${route.pattern}` : undefined
}

export const publicBaseUrl = (wranglerText: string): string | undefined => customDomainUrl(parseJsonc(wranglerText))

export const loadPublicBaseUrl = async (wranglerPath: URL | string): Promise<string | undefined> => {
  const path = typeof wranglerPath === 'string' ? wranglerPath : new NodeURL(wranglerPath.href)
  const text = await readFile(path, 'utf8').catch(() => undefined)
  return text === undefined ? undefined : publicBaseUrl(text)
}
