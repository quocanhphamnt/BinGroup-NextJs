import type { ConfigItem } from '@/types/common'

export const getConfigService = (configResponse: ConfigItem[]) => {
  return configResponse.reduce(
    (acc, curr) => {
      acc[curr.config_key] = curr.config_content

      return acc
    },
    {} as Record<string, string>
  )
}
