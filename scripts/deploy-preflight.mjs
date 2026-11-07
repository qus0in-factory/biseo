// Release gate: validate built effective config, print key names only.
import loadEnv from './protected-env.cjs'
Object.assign(process.env, loadEnv())
try{
 const{config}=await import('../dist/server/src/config.js')
 const{validateBootConfig}=await import('../dist/server/src/config-boot.js')
 const{missingConfigKeys}=await import('../dist/server/src/config-missing.js')
 try{
  validateBootConfig(config)
 }catch{
  for(const k of missingConfigKeys(config))console.error(k)
  process.exit(1)
 }
}catch{
 console.error('preflight: run pnpm build:server:clean first')
 process.exit(1)
}
