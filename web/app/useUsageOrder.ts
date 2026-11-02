import { useMemo } from 'react'
import type { UsageProvider } from '../domain/usage'
import { useOrderedIds } from './useOrderedIds'
import { useUsageOrderStore } from './usageOrderStore'
export function useUsageOrder(providers:UsageProvider[]){
 const ids=useMemo(()=>providers.map(p=>p.provider),[providers])
 const {order,move}=useOrderedIds(useUsageOrderStore,ids)
 const byId=new Map(providers.map(p=>[p.provider,p]))
 return{providers:order.map(id=>byId.get(id)).filter((p):p is UsageProvider=>Boolean(p)),move}
}
