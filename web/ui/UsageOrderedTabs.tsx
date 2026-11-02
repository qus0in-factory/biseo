import { UsageTabs } from './UsageTabs'
import type { UsageTabsProps } from './UsageTabs'
import { useUsageOrder } from '../app/useUsageOrder'

export function UsageOrderedTabs(props: Omit<UsageTabsProps, 'onMove'>) {
  const { providers, move } = useUsageOrder(props.providers)
  return <UsageTabs {...props} providers={providers} onMove={move} />
}
