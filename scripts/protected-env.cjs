const { readFileSync } = require('node:fs')
const { homedir } = require('node:os')
const { join } = require('node:path')
const { parseEnv } = require('node:util')

module.exports = (env = process.env) => {
  const path = env.BISEO_ENV_FILE ??
    join(env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'biseo', 'biseo.env')
  try {
    return parseEnv(readFileSync(path, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return {}
    throw new Error('BISEO_ENV_FILE: cannot read protected env file')
  }
}
