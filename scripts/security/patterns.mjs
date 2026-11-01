export const PATTERNS = [
  ['github-token', /gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}/],
  ['aws-key', /AKIA[0-9A-Z]{16}/],
  ['paseto', /v4\.local\.[A-Za-z0-9_-]{20,}/],
  ['slack-token', /xox[baprs]-[A-Za-z0-9-]{10,}/],
  ['tailnet-host', /[a-z0-9-]+\.ts\.net/],
  ['password-literal', /password\s*[:=]\s*["'][^"']{8,}["']/i],
]

export const GATED = new Set([
  'github-token',
  'private-key',
  'aws-key',
  'paseto',
  'slack-token',
])
