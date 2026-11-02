import{useEffect,useState}from'react'
import type{AsyncState}from'../domain/asyncState'
import{loadingState}from'../domain/asyncState'
import type{UsageProvider}from'../domain/usage'
import { useUsageStore } from './useUsageStore'
export function useUsageState(){
 const result=useState<AsyncState<UsageProvider[]>>(()=>loadingState())
 const status=result[0].status
 useEffect(()=>{useUsageStore.setState({status})},[status])
 return result
}
