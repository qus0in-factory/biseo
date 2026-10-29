import { TabsList, TabsTrigger } from '../components/ui/tabs'
import type { TabName } from '../domain/schemas/routeParams'

export function MobileTabsBar() {
  return (
    <div className="md:hidden w-full pb-2">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value={'panels' as TabName}>패널</TabsTrigger>
        <TabsTrigger value={'chat' as TabName}>채팅</TabsTrigger>
        <TabsTrigger value={'history' as TabName}>히스토리</TabsTrigger>
      </TabsList>
    </div>
  )
}
