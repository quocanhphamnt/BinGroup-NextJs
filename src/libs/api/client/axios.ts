import { NEXT_PUBLIC_BASE_URL } from '@/constants/env'
import { COOKIES_KEY } from '@/constants/generate'
import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { getCookie } from 'cookies-next'
import { getAccessTokenFromCookie } from './authClient.api'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.instance = axios.create({
      baseURL: NEXT_PUBLIC_BASE_URL + '/api',
      timeout: 120 * 1000,
      headers: {
        'Content-Type': 'application/json',
        'location-code': getCookie(COOKIES_KEY.LOCATION),
        'language-code': getCookie(COOKIES_KEY.LANG),
        cache: true
      }
    })
    this.accessToken = getAccessTokenFromCookie()
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = this.accessToken

          return config
        }

        return config
      },
      (error) => error.response
    )
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => error.response
    )
  }
}

const axiosRequest = new Http().instance

export default axiosRequest
