/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	NEXT_PRIVATE_BASE_API_PUBLIC_KEY,
	NEXT_PUBLIC_BASE_API_URL,
	NEXT_PUBLIC_DEFAULT_LANG,
	NEXT_PUBLIC_DEFAULT_LOCATION,
	NEXT_PUBLIC_WEBSITE_URL
} from '@/constants/env'
import { AUTHOR, DEVELOPMENT, META_TYPE } from '@/constants/generate'
import type { ApiResponse, Language, MetadataParams } from '@/types/common'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

/**
 * Normalize a URL string.
 *
 * @param {string} input - The input URL string to be normalized.
 * @returns {string} - The normalized URL string.
 */
export const useNormalizeUrl = (input: string) => {
  // Trim the input string
  input = input?.trim()

  // Add a leading slash if it's missing
  if (!input?.startsWith('/')) {
    input = '/' + input
  }

  // Replace multiple consecutive slashes with a single slash
  input = input?.replace(/\/{2,}/g, '/')

  // Remove trailing non-word and non-space characters
  input = input?.replace(/[^\w\s]$/, '')

  // If the input is empty, return a single slash
  if (!input) return '/'

  return input
}

/**
 * Generate a language-specific URL segment based on the provided language and location.
 *
 * @param {string} lang - The language code.
 * @param {string} location - The location code.
 * @returns {string} - The generated URL segment.
 */
export const useLangUrlSlashed = (lang: string, location: string) => {
  // Check if the language is "en" and the location is "gx"
  if (lang === NEXT_PUBLIC_DEFAULT_LANG && location === NEXT_PUBLIC_DEFAULT_LOCATION) {
    return ''
  }

  // Check if the location is "gx"
  if (location === NEXT_PUBLIC_DEFAULT_LOCATION) {
    return `/${lang}`
  }

  // Default case: combine language and location with a dash
  return `/${lang}-${location}`
}

/**
 * Performs an HTTP request using fetch.
 *
 * @param {string} endpoint The API endpoint.
 * @param {string} lang The language of the country.
 * @param {string} location The location of the country.
 * @param {string} method The HTTP method (GET or POST, default is GET).
 * @param {Object} data The request data (only used for POST method).
 * @param {Object} options Other custom options for the request.
 *
 * @returns {Promise} A Promise that returns JSON data or an error if any.
 */
export const useFetch = async <T>(
  endpoint: string,
  lang: string = NEXT_PUBLIC_DEFAULT_LANG,
  location: string = NEXT_PUBLIC_DEFAULT_LOCATION,
  method = 'GET',
  data: Record<string, any> = {},
  cache: boolean = true,
  headerOptions: Record<string, any> = {},
  request: Record<string, any> = {},
  tagName: string = 'all'
): Promise<ApiResponse<T> | { success: boolean; data: null; pagination?: null; statusCode?: number }> => {
  try {
    const isFormData = headerOptions['isForm']

    // Create default headers with language and location
    const customHeaders: Record<string, string> = {
      Accept: 'application/json',
      'language-code': lang,
      'location-code': location,
      ...headerOptions
    }

    if (!isFormData) {
      customHeaders['Content-Type'] = 'application/json'
    }

    // Add public key if available
    if (NEXT_PRIVATE_BASE_API_PUBLIC_KEY) {
      customHeaders['api-public-key'] = NEXT_PRIVATE_BASE_API_PUBLIC_KEY
    }

    // Create request options
    const requestOptions: RequestInit & { body?: string | BodyInit | null } = {
      method: method,
      headers: customHeaders,
      ...request
    }

    if (!cache) {
      requestOptions.cache = 'no-store'
    } else {
      requestOptions.next = { tags: [tagName] }
    }

    if (method === 'POST') {
      requestOptions.body = isFormData ? (data as BodyInit) : JSON.stringify(data)
    }

    // Construct the full URL
    const url = endpoint.startsWith('http') ? endpoint : `${NEXT_PUBLIC_BASE_API_URL}/${endpoint}`

    // Perform the fetch request
    const response = await fetch(url, requestOptions)

    // Handle HTTP status
    if (response.status === 429) {
      return {
        success: false,
        data: null
      }
    }

    const res = await response.json()

    res.statusCode = response.status

    try {
      return res ? res : await response.json()
    } catch (error) {
      return res
    }
  } catch (error) {
    return {
      success: false,
      data: null
    }
  }
}

/**
 * A function that handles the case when a resource is not found.
 *
 * @return {void} Throws an error if not found in production, calls notFound() in development.
 */
export const useNotFound = () => {
  if (process.env.NODE_ENV === DEVELOPMENT) {
    notFound()
  }

  throw notFound()
}

/**
 * Generates metadata for a webpage.
 * @param {object} options - The options object.
 * @param {string} options.title - The title of the webpage.
 * @param {string} options.page_meta_description - The meta description of the webpage.
 * @param {string} options.page_meta_keyword - The meta keyword of the webpage.
 * @param {string} options.page_meta_image - The URL of the meta image of the webpage.
 * @param {string} options.page_name - The name of the webpage.
 * @param {string} options.current_url - The current URL of the webpage.
 * @param {Array} options.all_locations - The array of all locations related to the webpage.
 * @returns {Promise<Metadata>} A promise that resolves to the metadata object.
 */
export async function useGenerateMetadata({
  title,
  page_meta_description,
  page_meta_keyword,
  page_meta_image,
  page_name,
  current_url,
  all_locations
}: MetadataParams): Promise<Metadata> {
  // Set up current url
  const currentUrl = `${NEXT_PUBLIC_WEBSITE_URL}/${current_url}`
    .replace(/(?<!http:|https:)\/{2,}/g, '/')
    .replace(/\/$/, '')

  // Setup location languages
  const listLanguages = all_locations
    .map((item) => (item?.languages || {}).map((item) => item))
    ?.flat() as unknown as Language[]

  // Get list url language location
  const listUrlLanguage =
    listLanguages.length &&
    listLanguages?.map((item) => {
      const url = useNormalizeUrl(`/${item.location_alternate_hreflang}`)

      return {
        url: url,
        location_alternate_hreflang: item.location_alternate_hreflang
      }
    })

  const languages =
    listUrlLanguage &&
    listUrlLanguage?.reduce((acc: { [key: string]: string }, curr) => {
      let url = NEXT_PUBLIC_WEBSITE_URL + curr.url + '/' + current_url
      url = url.replace(/(?<!http:|https:)\/{2,}/g, '/').replace(/\/$/, '')
      acc[curr.location_alternate_hreflang] = url

      return acc
    }, {})

  const finalLanguages = {
    'x-default': currentUrl,
    ...languages
  }

  return {
    title: title || page_name,
    description: page_meta_description,
    keywords: page_meta_keyword,
    authors: {
      name: AUTHOR
    },
    openGraph: {
      siteName: page_name,
      title: title || page_name,
      description: page_meta_description,
      images: [
        {
          url: page_meta_image,
          width: 1920,
          height: 1080
        }
      ],
      locale: '',
      type: META_TYPE
    },
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: currentUrl,
      languages: finalLanguages
    }
  }
}

/**
 * Parses a JSON string and returns the parsed object.
 * If the input string is undefined or null, returns null.
 * If the input string is not a valid JSON, returns null.
 *
 * @param jsonString - The JSON string to parse.
 * @returns The parsed JSON object or null.
 */
export const parseJSON = (jsonString: string | undefined | null) => {
  try {
    return jsonString ? JSON.parse(jsonString) : null
  } catch (error) {
    return null
  }
}

/**
 * Format number.
 *
 * @param value - The string to format.
 * @returns The string after format.
 */
export const formatNumber = (value: string) => {
  return value.replace(/[^\d.]/g, '')
}

/**
 *
 * @param array []
 * @param iteratee callback
 * @returns new Array
 */
export const _map = <T, U>(array: T[] | null | undefined, iteratee: (item: T, index: number, array: T[]) => U): U[] => {
  if (!array || array.length === 0) {
    return []
  }

  const result: U[] = []

  for (let i = 0; i < array.length; i++) {
    result.push(iteratee(array[i], i, array))
  }

  return result
}
/**
 * Replaces configuration keys in a given content string with their corresponding values from the config data.
 * example: <div>|||CONFIG:txt_communication_channel|||</div>
 * example: const content = replaceConfigKeys(dataContent, dataConfig)
 * @param dataContent - The content string containing configuration placeholders.
 * @param configData - An array of objects containing `config_key` and `config_content` properties.
 * @returns The content string with the configuration placeholders replaced with their corresponding values.
 */

export function replaceContentConfigKeys(
  dataContent: string,
  configData: { config_key: string; config_content: string }[]
): string {
  // Create a map for easy lookup of configuration content by key
  const configMap: { [key: string]: string } = configData.reduce(
    (acc, item) => {
      // Map each config key to its corresponding content, or fallback to the key if content is missing
      acc[item.config_key] = item.config_content || item.config_key

      return acc
    },
    {} as { [key: string]: string }
  )

  // Replace all configuration placeholders in the content with the corresponding values from the config map
  let result = dataContent.replace(/\|\|\|CONFIG:([^|]*?)\|\|\|/g, (_, key) =>
    // If the key exists in the config map, replace it with the corresponding content, otherwise, keep the placeholder
    key in configMap ? configMap[key] : `|||CONFIG:${key}|||`
  )

  result = JSON.stringify(result)
    ?.replaceAll('<p>&nbsp;</p>', '')
    .replaceAll('<p></p>', '')
    .replaceAll('<br></br>', '<br />')
    .replaceAll('<br><br>', '<br />')
    .replaceAll('<br /><br />', '<br />')

  // Return the final content with all replacements made
  return JSON.parse(result)
}
// ----------------------------------------------------------------------
// Custom find object in array

export const _find = <T>(array: T[], searchKey: keyof T, searchValue: T[keyof T], defaultValue: T = {} as T): T => {
  if (!Array.isArray(array)) {
    return defaultValue
  }

  return array.find((item) => item[searchKey] === searchValue) || defaultValue
}

// search
export const useSearch = (
  value: string,
  arr: SelectItemDropdown[] = [],
  fieldName: FieldNameSelect = { itemIcon: 'icon', itemName: 'name', itemId: 'id' }
) => {
  const { itemName } = fieldName
  const result = arr.filter(
    (item) =>
      String(item[itemName])?.toLowerCase()?.includes(value?.toLowerCase()) ||
      String(item?.value)?.toLowerCase()?.includes(value?.toLowerCase()) ||
      String(item?.country_code)?.toLowerCase()?.includes(value?.toLowerCase())
  )

  return result
}
