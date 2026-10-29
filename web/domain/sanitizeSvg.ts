export function sanitizeSvg(svg: string): string {
  let out = svg
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  out = out.replace(/<script\b[^>]*\/?>/gi, '')
  out = out.replace(/<foreignObject\b[^>]*>[\s\S]*?<\/foreignObject>/gi, '')
  out = out.replace(/\s+on[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '')
  out = out.replace(/javascript:/gi, '')
  out = out.replace(/\s+(href|xlink:href)\s*=\s*"(https?:[^"]*)"/gi, '')
  out = out.replace(/\s+(href|xlink:href)\s*=\s*'(https?:[^']*)'/gi, '')
  out = out.replace(/url\(\s*['"]?https?:[^)]*\)/gi, 'none')
  return out
}
