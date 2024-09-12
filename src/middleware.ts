/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextRequest } from 'next/server'
import { NextResponse, userAgent } from 'next/server'
import { NEXT_PUBLIC_DEFAULT_LANG, NEXT_PUBLIC_DEFAULT_LOCATION } from './constants/env'
import {
  COOKIES_KEY,
  CRAWL,
  CURRENCY,
  DEFAULT_CURRENT_ACTIVE_CURRENCY,
  DESKTOP,
  DEVELOPMENT,
  LIVE,
  MOBILE,
  NO_AUTH_REQUIRED,
  PAGE_QUERY_PARAMS,
  REQUIRED_AUTH
} from './constants/generate'
import { PAGE_KEYWORD_LOGIN } from './constants/pageKeyword'
import { useFetch } from './libs/utils/utilFuncs'
import type { Language, LocationsResponseData, PageMetaDataResponse } from './types/common'

export const config = {
  matcher: ['/((?!api|_next/static|images|favicon.ico|notfound|processing|404|robots|.*\\.svg).*)']
}

/**
 * This function takes an array of encoded strings and returns an object.
 * Each string in the array should be in the format 'key%3Dvalue'.
 * The function decodes each string, splits it into a key and a value, and adds them to the object.
 * If the key is 'pageKeyword', the value will have all underscores replaced with hyphens.
 *
 * @param {string[]} arr - The array of encoded strings.
 * @returns {Partial<Record<(typeof PAGE_QUERY_PARAMS)[number], string>>} An object where the keys are the decoded keys from the strings in the array, and the values are the corresponding decoded values. If the key is 'pageKeyword', underscores are replaced by hyphens in the value.
 */
export const useSearchQuery = (arr: string[]): Partial<Record<(typeof PAGE_QUERY_PARAMS)[number], string>> => {
  const obj = arr
    .map((item) => decodeURIComponent(item).split('='))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: key === 'pageKeyword' ? value.replaceAll('_', '-') : value
      }),
      {}
    )

  return obj
}

/**
 * This function sets two cookies in the HTTP response.
 *
 * @param {any} response - The HTTP response object where the cookies should be set.
 * @param {string} country - The value to set for the '__country' cookie.
 * @param {string} ip - The value to set for the '__ip' cookie.
 */
function customResponse(
  response: NextResponse,
  country: string,
  ip: string,
  langCode: string,
  locationCode: string,
  currency: string
) {
  response.cookies.set(COOKIES_KEY.COUNTRY, country)
  response.cookies.set(COOKIES_KEY.IP, ip)
  response.cookies.set(COOKIES_KEY.LANG, langCode)
  response.cookies.set(COOKIES_KEY.LOCATION, locationCode)
  response.cookies.set(COOKIES_KEY.CURRENCY, currency)

  return response as NextResponse
}

/**
 * This function determines the language and location based on the value of routerLevel1.
 *
 * @param {any} locations - The object containing location and language data.
 * @param {string} routerLevel1 - The value of the router's level 1.
 * @returns {string[]} - An array containing the determined language and location.
 */
export function useQueryParams(routerLevel1: string) {
  const LANG_CODE_EXCEPTIONS = ['zh-TW']
  const [routerLever1NoQuery, routerQuery] = routerLevel1.split('~')
  const exception = LANG_CODE_EXCEPTIONS.find((code) => routerLever1NoQuery.includes(code))

  if (exception) {
    const parts = routerLever1NoQuery.split(exception)
    const extraParts = (parts[1] || NEXT_PUBLIC_DEFAULT_LOCATION).split('-').filter(Boolean)

    return [exception, ...extraParts]
  }

  const [lang, location, ...extra] = routerLever1NoQuery.split('-')
  const extraQuery = decodeURIComponent(routerQuery).split('&')

  let resultLocation = location || NEXT_PUBLIC_DEFAULT_LOCATION
  let resultLang = lang || NEXT_PUBLIC_DEFAULT_LANG

  if (location?.length !== 2) {
    resultLocation = NEXT_PUBLIC_DEFAULT_LOCATION
  }

  if (lang?.length !== 2) {
    resultLang = NEXT_PUBLIC_DEFAULT_LANG
  }

  if (lang && location && (lang?.length !== 2 || location?.length !== 2)) {
    resultLang = NEXT_PUBLIC_DEFAULT_LANG
    resultLocation = NEXT_PUBLIC_DEFAULT_LOCATION
  }

  return [resultLang, resultLocation, ...extra, ...extraQuery]
}

const DEFAULT_IP_COMPANY = '118.69.61.8'
const PAGE_DETACHED_IP = '1'

export async function middleware(request: NextRequest) {
  const cloudflare = NEXT_PUBLIC_DEFAULT_LOCATION
  const cloudflareCountryCode = (request.headers.get('cf-ipcountry') as string) || NEXT_PUBLIC_DEFAULT_LOCATION // get cloudflare location country code

  const { device, ua } = userAgent(request)
  const isCrawl = ua?.includes('Chrome-Lighthouse') ? CRAWL : LIVE
  const viewport = device?.type === MOBILE ? MOBILE : DESKTOP
  let clientIP = request.headers.get('x-forwarded-for')?.split(',').shift() as string

  const { pathname, search } = request.nextUrl
  const [_, routerLevel1, routerLevel2] = pathname.split('/')
  const [lang, location] = useQueryParams(routerLevel1)

  // Get cookie from client
  const isUserChangedLocation = request.cookies.get(COOKIES_KEY.IS_REDIRECT)?.value
  const useAuthToken = request.cookies.get(COOKIES_KEY.USER_TOKEN)?.value

  const paramCurrency = request.nextUrl.searchParams.get(CURRENCY)
  const cookieCurrency = request.cookies.get(COOKIES_KEY.CURRENCY)?.value || DEFAULT_CURRENT_ACTIVE_CURRENCY
  const currency = paramCurrency || cookieCurrency

  if (process.env.NODE_ENV === DEVELOPMENT) clientIP = DEFAULT_IP_COMPANY

  // Get page param from query url
  const listParams: string[] = []
  PAGE_QUERY_PARAMS.forEach((param) => {
    const searchValue = request.nextUrl.searchParams.get(param)

    if (searchValue) listParams.push(`${param}=${searchValue}`)
  })

  listParams.push(`currency=${currency}`)

  const [queryLang, queryLocation] = routerLevel1.split('-')

  // Check router include location gx and language is en
  if (queryLocation === NEXT_PUBLIC_DEFAULT_LOCATION) {
    if (queryLang === NEXT_PUBLIC_DEFAULT_LANG) {
      return NextResponse.redirect(
        new URL(
          pathname.replace(
            `/${NEXT_PUBLIC_DEFAULT_LANG}-${NEXT_PUBLIC_DEFAULT_LOCATION}`,
            `${routerLevel2 ? '' : '/'}${search}`
          ),
          request.url
        )
      )
    }

    return NextResponse.redirect(new URL(pathname.replace(`-${NEXT_PUBLIC_DEFAULT_LOCATION}`, ''), request.url))
  } else {
    if (queryLang === NEXT_PUBLIC_DEFAULT_LANG && location === NEXT_PUBLIC_DEFAULT_LOCATION) {
      return NextResponse.redirect(
        new URL(pathname.replace(`/${NEXT_PUBLIC_DEFAULT_LANG}`, `${!routerLevel2 ? '/' : ''}${search}`), request.url)
      )
    }
  }

  const { pathnameByLangLocation, pageKeyword } = await getPathName(pathname, routerLevel2, lang, location)

  listParams.push(`pageKeyword=${(pageKeyword || routerLevel1).replaceAll('-', '_')}`)

  const query = `${viewport}-${isCrawl}${listParams.length > 0 ? `~${listParams.join('&')}` : ''}`

  if (pathnameByLangLocation === 'notfound') return NextResponse.redirect(new URL('/notfound.html', request.url))

  // Check home page and redirect by cloudflare
  const isHomePage = Boolean(
    pathnameByLangLocation.endsWith(`/`) ||
      pathnameByLangLocation.endsWith(`/${lang}`) ||
      pathnameByLangLocation.endsWith(`/${lang}-${cloudflare?.toLowerCase()}`) ||
      pathnameByLangLocation.endsWith(`/${lang}-${location}`)
  )

  if (!isUserChangedLocation && isHomePage) {
    if (!routerLevel1) {
      let currentLang = NEXT_PUBLIC_DEFAULT_LANG
      let currentLocation = NEXT_PUBLIC_DEFAULT_LOCATION

      const getAllLocation = await useFetch<LocationsResponseData[]>(
        'location',
        NEXT_PUBLIC_DEFAULT_LANG,
        NEXT_PUBLIC_DEFAULT_LOCATION,
        'GET',
        {},
        true
      )

      const userLocationInfo = getAllLocation.data?.find(
        (item) => item.location_country_code === cloudflare?.toLocaleLowerCase()
      )

      if (userLocationInfo) {
        currentLocation = cloudflare?.toLowerCase()
        currentLang =
          Object.values(userLocationInfo?.languages as unknown as Language)?.[0]?.location_lang_code ||
          NEXT_PUBLIC_DEFAULT_LANG
      }

      const currentUrl = `/${currentLang}-${currentLocation}${search}`
      const response = NextResponse.redirect(new URL(currentUrl, request.url))

      response.cookies.set(COOKIES_KEY.IS_REDIRECT, PAGE_DETACHED_IP)

      return customResponse(response, cloudflareCountryCode, clientIP, lang, location, currency)
    } else {
      const response = NextResponse.rewrite(new URL(`/${lang}-${location}-${query}${search}`, request.url))

      return customResponse(response, cloudflareCountryCode, clientIP, lang, location, currency)
    }
  }

  // Check router and rewrite to page router
  if (lang === NEXT_PUBLIC_DEFAULT_LANG && location === NEXT_PUBLIC_DEFAULT_LOCATION) {
    // Check required auth page
    if (REQUIRED_AUTH.includes(pathnameByLangLocation) && !useAuthToken) {
      return NextResponse.redirect(new URL(`/${PAGE_KEYWORD_LOGIN}`, request.url))
    }

    if (NO_AUTH_REQUIRED.includes(pathnameByLangLocation) && useAuthToken) {
      return NextResponse.redirect(new URL(`/`, request.url))
    }

    const currentUrl = `/${lang}-${location}-${query}${pathnameByLangLocation}${search}`
    const response = NextResponse.rewrite(new URL(currentUrl, request.url))

    return customResponse(response, cloudflareCountryCode, clientIP, lang, location, currency)
  } else {
    const currentUrl = pathnameByLangLocation.replace(`/${routerLevel1}`, '')

    // Check required auth page
    if (REQUIRED_AUTH.includes(currentUrl) && !useAuthToken) {
      return NextResponse.redirect(new URL(`/${lang}-${location}/${PAGE_KEYWORD_LOGIN}`, request.url))
    }

    if (NO_AUTH_REQUIRED.includes(currentUrl) && useAuthToken) {
      return NextResponse.redirect(new URL(`/${lang}-${location}`, request.url))
    }

    const response = NextResponse.rewrite(new URL(`/${lang}-${location}-${query}${currentUrl}${search}`, request.url))

    return customResponse(response, cloudflareCountryCode, clientIP, lang, location, currency)
  }
}

const getPathName = async (pathname: string, pageLevelRouter: string, lang: string, location: string) => {
  if (lang === NEXT_PUBLIC_DEFAULT_LANG && location === NEXT_PUBLIC_DEFAULT_LOCATION) {
    return { pathnameByLangLocation: pathname }
  }

  const pageSlugByLangLocation = await useFetch<PageMetaDataResponse[]>(
    `init-route/page/${pageLevelRouter}`,
    lang,
    location,
    'GET',
    {},
    true
  )

  if (pageSlugByLangLocation.data && pageSlugByLangLocation.data.length > 0 && pageLevelRouter) {
    const pageOriginGlobal = pageSlugByLangLocation.data.find(
      (page) => page?.page_location_country_code === NEXT_PUBLIC_DEFAULT_LOCATION
    )

    if (pageOriginGlobal) {
      return {
        pathnameByLangLocation: pathname.replace(pageLevelRouter, pageOriginGlobal?.page_keyword),
        pageKeyword: pageLevelRouter
      }
    } else return { pathnameByLangLocation: 'notfound' }
  }

  return { pathnameByLangLocation: 'notfound' }
}
