import type { ApiResponse, ConfigItem, LocationsResponseData } from '@/types/common'
import { getConfigService } from '../services/getConfig.service'
import axiosRequest from './axios'

const commonClientApi = {
  async extractConfigData<T>(listConfigKey: readonly string[]) {
    const configResponse = await axiosRequest.get<ApiResponse<ConfigItem[]>>('/config', {
      params: {
        key: listConfigKey.join('-')
      }
    })

    if (!configResponse.data.data) {
      return {} as T
    }

    return getConfigService(configResponse.data.data) as T
  },

  async getLocations() {
    const response = await axiosRequest.get<ApiResponse<LocationsResponseData[]>>('/location')

    return response?.data?.data
  }
}

export default commonClientApi
