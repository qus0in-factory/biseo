import{loadPublicBaseUrl}from'./wrangler-public-url.js'
import{queueCompletedPath}from'../../shared/domain/queue-callback.js'
import{logger}from'./logger.js'
export async function queueCallbackUrl(
 fileUrl?:string,envUrl=process.env.QUEUE_CALLBACK_URL,
 path:URL|string='wrangler.jsonc',warn=(message:string)=>logger.warn(message),
){
 if(envUrl!==undefined)return envUrl
 if(fileUrl!==undefined)return fileUrl
 const base=await loadPublicBaseUrl(path).catch(()=>undefined)
 if(base)return base+queueCompletedPath
 warn('queue.callback_unresolved: set QUEUE_CALLBACK_URL')
 return undefined
}
