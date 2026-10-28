import {connect}from'node:net'
import {homedir}from'node:os'
import {join}from'node:path'
import {handshake}from'./herdr-handshake.js'
import {subscriptionLine}from'./herdr-subscription-request.js'
export async function subscribe(paneIds:string[],onEvent:(e:string)=>void,onClose:()=>void,timeoutMs=3000):Promise<()=>void>{
 const sock=connect(process.env.HERDR_SOCKET_PATH??join(homedir(),'.config/herdr/herdr.sock'))
 const close=()=>sock.destroy()
 sock.on('connect',()=>sock.write(subscriptionLine(paneIds)))
 await handshake(sock,onEvent,onClose,close,timeoutMs)
 return close
}
