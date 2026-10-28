const config = require('./config/runtime.json')

module.exports = {
  apps: [
    {
      name: process.env.PROCESS_NAME ?? config.processName,
      script: 'src/index.js',
      cwd: __dirname,
    },
  ],
}
