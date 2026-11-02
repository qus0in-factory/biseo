import { useEffect, useMemo } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { mergeOrder, moveItem, sameOrder } from '../domain/order'
import type { OrderState } from './orderStore'
export function useOrderedIds(useStore:UseBoundStore<StoreApi<OrderState>>,current:string[]){
 const saved=useStore(s=>s.order),save=useStore(s=>s.save)
 const order=useMemo(()=>mergeOrder(saved,current),[saved,current])
 useEffect(()=>{if(!current.length||sameOrder(order,saved))return;save(order)},[order,saved,save,current.length])
 return{order,move:(from:number,to:number)=>save(moveItem(order,from,to))}
}
