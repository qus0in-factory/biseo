// JSONC: strip comments and trailing commas outside strings.
const fail = (w: string) => { throw new SyntaxError(`jsonc: unterminated ${w}`) }

const stringEnd = (text: string, from: number) => {
  for (let i = from; i < text.length; i++) {
    if (text[i] === '\\') i++
    else if (text[i] === '"') return i
  }
  return fail('string')
}

const strip = (text: string) => {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      const end = stringEnd(text, i + 1)
      out += text.slice(i, end + 1)
      i = end
    } else if (text.startsWith('//', i)) {
      const nl = text.indexOf('\n', i)
      if (nl === -1) break
      i = nl - 1
    } else if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2)
      i = end === -1 ? fail('block comment') : end + 1
    } else if (c === '}' || c === ']') out = out.replace(/,\s*$/, '') + c
    else out += c
  }
  return out
}

export const parseJsonc = (text: string): unknown => JSON.parse(strip(text))
