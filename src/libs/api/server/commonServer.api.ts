import { NEXT_PUBLIC_BASE_URL } from '@/constants/env'
import { useFetch } from '@/libs/utils/utilFuncs'
import type { ConfigItem } from '@/types/common'
import { getConfigService } from '../services/getConfig.service'

const commonServerApi = {
  async extractConfigData<T>(configKey: readonly string[], lang: string, location: string): Promise<T> {
    const configResponse = await useFetch<ConfigItem[]>(
      `${NEXT_PUBLIC_BASE_URL}/api/config?key=${configKey.join('-')}`,
      lang,
      location
    )

    if (!configResponse.success || !configResponse.data) {
      const ob = configKey.reduce(
        (acc, key) => {
          acc[key] = key

          return acc
        },
        {} as Record<string, string>
      )

      return ob as T
    }

    return getConfigService(configResponse.data) as T
  },

  async getPage<T>(page: string, lang: string, location: string): Promise<T | false> {
    try {
      const response = await useFetch<T>(`page/${page}`, lang, location)

      if (!response.success) return false

      return response.data as T
    } catch (error) {
      return false
    }
  }
}

export default commonServerApi
