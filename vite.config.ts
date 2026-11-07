import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json' with { type: 'json' }
import verify from './config/release-verify.json' with { type: 'json' }

export default defineConfig({
  root: 'web',
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_VERSION_MARK__: JSON.stringify(`${verify.versionMarkPrefix}${pkg.version}`),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: { outDir: '../dist/client', emptyOutDir: true },
})
