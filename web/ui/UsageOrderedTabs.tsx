import { UsageTabs } from './UsageTabs'
import type { UsageTabsProps } from './UsageTabs'

export function UsageOrderedTabs(props: Omit<UsageTabsProps, 'step'>) {
  const { providers, tab, onTabChange } = props
  const step = (dir: number) => {
    const ids = ['bookmarked', ...providers.map((p) => p.provider)]
    onTabChange(ids[(ids.indexOf(tab) + dir + ids.length) % ids.length])
  }
  return <UsageTabs {...props} providers={providers} step={step} />
}
