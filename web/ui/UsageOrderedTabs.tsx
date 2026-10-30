import { shownUsageProviders } from '../domain/usageShownProviders'
import { useUsageOrder } from '../app/useUsageOrder'
import { UsageOrderSection } from './UsageOrderSection'
import { UsageTabs } from './UsageTabs'
import type { UsageTabsProps } from './UsageTabs'

export function UsageOrderedTabs(props: Omit<UsageTabsProps, 'step'>) {
  const { providers, tab, onTabChange } = props
  const orderState = useUsageOrder()
  const shown = shownUsageProviders(providers, orderState.order, orderState.hidden)
  const step = (dir: number) => {
    const ids = ['bookmarked', ...shown.map((p) => p.provider)]
    onTabChange(ids[(ids.indexOf(tab) + dir + ids.length) % ids.length])
  }
  return (
    <>
      <UsageOrderSection providers={providers} orderState={orderState} />
      <UsageTabs {...props} providers={shown} step={step} />
    </>
  )
}
