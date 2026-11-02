import { createOrderStore } from './orderStore'
import r from '../resources.json'
export const useUsageOrderStore=createOrderStore(r.usageOrderStorageKey)
