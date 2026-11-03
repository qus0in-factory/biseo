import Claude from '@lobehub/icons/es/Claude/components/Mono'
import DeepSeek from '@lobehub/icons/es/DeepSeek/components/Mono'
import Gemini from '@lobehub/icons/es/Gemini/components/Mono'
import OpenAI from '@lobehub/icons/es/OpenAI/components/Mono'
import { Bot } from 'lucide-react'
import type { IconType } from '@lobehub/icons'
import type { ModelFamily } from '../domain/modelFamily'
import type { ProviderIconFamily } from '../domain/usage-provider-family'
import { providerIcons } from './providerIcons'

const icons: Partial<Record<ModelFamily | ProviderIconFamily, IconType>> = {
  ...providerIcons,
  claude: Claude,
  gpt: OpenAI,
  gemini: Gemini,
  deepseek: DeepSeek,
}

export function ModelIcon({ family }: { family: ModelFamily | ProviderIconFamily }) {
  const Icon = icons[family]
  if (!Icon) return <Bot size={14} aria-hidden="true" className="shrink-0 text-muted-foreground" />
  return <Icon size={14} aria-hidden="true" className="shrink-0 text-muted-foreground" />
}
