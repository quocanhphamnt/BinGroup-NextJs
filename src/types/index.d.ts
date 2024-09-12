/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
export {}

declare global {
  interface Window {
    __gcse: any
    dataLayer: any
    gtag: any
    clipboardData: any
    google: any
  }

  interface CustomOptionsType {
    label: string
    value: string
  }

  interface CountryType {
    country_id?: number
    country_code?: string
    country_name?: string
    country_timezone?: string
    area_id?: number
    area_name?: string
    area_lat?: number
    area_lng?: number
    country_flag?: string
    states?: never[]
  }

  interface CustomObject {
    [key: string]: string | number
  }

  interface FieldNameSelect {
    [key: string]: string | number
  }

  interface SelectItemDropdown {
    id?: string | number
    [key: string]: string | number
  }
}
interface Window {
  dataLayer: CustomObject
}

declare const grecaptcha: any

declare const Tawk_API: {
  toggle: () => void
}
