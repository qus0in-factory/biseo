import fs from 'node:fs'
import path from 'node:path'

export const read = (f: string) =>
  fs.readFileSync(path.resolve(import.meta.dirname, '..', f), 'utf8')

export function vars(css: string) {
  return Object.fromEntries(
    [...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  )
}

export function rule(css: string, sel: string) {
  const i = css.indexOf(`${sel} {`)
  if (i < 0) throw new Error(`missing ${sel}`)
  return Object.fromEntries(
    css
      .slice(i + sel.length + 2)
      .split('}')[0]
      .split(';')
      .map((d) => {
        const j = d.indexOf(':')
        return [d.slice(0, j).trim(), d.slice(j + 1).trim()]
      })
      .filter(([k, v]) => k && v),
  )
}

export function resolve(value: string, v: Record<string, string>): string {
  return value.replace(/var\(--([\w-]+)\)/g, (_, k) => resolve(v[k] ?? '', v))
}
