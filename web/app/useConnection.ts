import{useCallback,useState}from'react'
import{connectionStatus,type ConnectionStatus}from'../domain/connectionStatus'
export function useConnection(){
 const[connection,setConnection]=useState<ConnectionStatus>('connecting')
 const setOnline=useCallback((ok:boolean)=>setConnection(c=>connectionStatus(ok,c==='connected')),[])
 return{online:connection==='connected',connection,setOnline}
}
