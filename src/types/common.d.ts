
export interface ConfigItem {
  config_key: string
  config_content: string
}

export type PickConfigKeys<T, K> = Pick<T, Extract<keyof T, keyof K>>

export type ApiResponse<Data> = {
  success: boolean
  data?: Data
  pagination?: PaginationType
  validator?: Record<string, string>
  message?: string
  statusCode?: number
}

export type Pagination = {
  current_page: number
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
}

export type CountryData = {
  location_country_code: string
  area_id: number
  area_name: string
  area_lat: number
  area_lng: number
  country_name: string
  country_keyword?: string
  languages: {
    [key: string]: Language
  }[]
}

interface Language {
  location_lang_code: string
  language_name: string
  language_name_en: string
  location_is_temp: string
  location_alternate_hreflang: string
}

interface LocationsResponseData {
  location_country_code: string
  country_area_id: number
  country_name: string
  languages: Language[]
}

interface MetadataParams {
  title: string
  page_meta_description: string
  page_meta_keyword: string
  page_meta_image: string
  current_url: string
  locale?: string
  lang: string
  location: string
  page_name: string
  all_locations: LocationsResponseData[]
}

export type CustomTypeConfig<T> = Record<string, T>

export interface PageMetaDataResponse {
  page_id: number
  page_name: string
  page_title: string
  page_keyword: string
  page_meta_keyword: string
  page_meta_description: string
  page_meta_image: null
  page_content: string
  page_location_country_code: string
  page_style: string
}
