import { COOKIES_KEY } from '@/constants/generate'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'

export const cookieStorageEventTarget = new EventTarget()

export const setAccessTokenToCookie = (access_token: string) => {
  setCookie(COOKIES_KEY.USER_TOKEN, access_token)
}

export const clearCookie = () => {
  deleteCookie(COOKIES_KEY.USER_TOKEN)

  const clearCookieEvent = new Event('clearCookie')
  cookieStorageEventTarget.dispatchEvent(clearCookieEvent)
}

export const getAccessTokenFromCookie = () => getCookie(COOKIES_KEY.USER_TOKEN) || ''
