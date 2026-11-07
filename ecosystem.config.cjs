const { name } = require('./package.json')
const env = require('./scripts/protected-env.cjs')()

module.exports = {
  apps: [
    {
      name: env.PROCESS_NAME ?? process.env.PROCESS_NAME ?? name,
      env,
      script: 'dist/server/src/index.js',
      cwd: __dirname,
    },
  ],
}
