import {createFakeD1} from './fake-d1.js'
import {queuedRecord} from '../app/queued-turn.js'
import {reserveTurn} from '../app/reserve-turn.js'
export async function queueFixture(){
 const db=createFakeD1()
 const put=async(id:string,pane='p',owner='o',ws='w',text='hi')=>{
  const r=queuedRecord({requestId:id,workspaceId:ws,paneId:pane,text},owner,ws,'2026-01-01','generation-1')
  return reserveTurn(db,r)
 }
 return {db,put}
}
