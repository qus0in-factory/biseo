// Parses JSONC: drops // and /* */ comments and trailing commas, keeps string contents intact.
export const parseJsonc = (text) => {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"') {
      const end = text.slice(i + 1).search(/(?<!\\)"/) + i + 1
      out += text.slice(i, end + 1)
      i = end
    } else if (text.startsWith('//', i)) {
      i = text.indexOf('\n', i) - 1
      if (i < 0) break
    } else if (text.startsWith('/*', i)) {
      i = text.indexOf('*/', i + 2) + 1
    } else out += c
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'))
}
