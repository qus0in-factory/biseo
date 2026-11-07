const { name } = require('./package.json')

module.exports = {
  apps: [
    {
      name: process.env.PROCESS_NAME ?? name,
      script: 'dist/server/src/index.js',
      cwd: __dirname,
    },
  ],
}
