import { useMemo } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { useOrderedIds } from './useOrderedIds'
import { usePaneOrderStore } from './paneOrderStore'
export function usePaneOrder(panes:PaneSummary[]){
 const ids=useMemo(()=>panes.map(p=>p.paneId),[panes])
 const {order,move}=useOrderedIds(usePaneOrderStore,ids)
 const byId=new Map(panes.map(p=>[p.paneId,p]))
 return{panes:order.map(id=>byId.get(id)).filter((p):p is PaneSummary=>Boolean(p)),move}
}
