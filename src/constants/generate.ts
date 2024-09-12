import { NEXT_PUBLIC_DEFAULT_LANG, NEXT_PUBLIC_DEFAULT_LOCATION } from './env'

export const DEVELOPMENT = 'development'

export const PRODUCTION = 'production'

export const DESKTOP = 'desktop'

export const MOBILE = 'mobile'

export const CRAWL = 'CRAWL'

export const LIVE = 'LIVE'

export const DEFAULT_CURRENT_ACTIVE_LOCATION = 'all'

export const DEFAULT_CURRENT_ACTIVE_CURRENCY = 'USD'

export const AUTHOR = 'One IBC Limited'

export const META_TYPE = 'website'

export const DEFAULT_LANG_VIETNAMESE = 'vi'

export const META_VIEW_PORT = 'width=device-width, initial-scale=1, maximum-scale=1'

export const GLOBAL_LANGUAGE = {
  area_name: 'Global Website',
  location_country_code: NEXT_PUBLIC_DEFAULT_LOCATION,
  items: [
    {
      location_country_code: NEXT_PUBLIC_DEFAULT_LOCATION,
      area_id: 6,
      area_name: 'Global',
      area_lat: 0,
      area_lng: 0,
      country_name: 'Global',
      languages: {
        en: {
          location_lang_code: NEXT_PUBLIC_DEFAULT_LANG,
          location_country_code: NEXT_PUBLIC_DEFAULT_LOCATION,
          language_name: 'English',
          language_name_en: 'English',
          location_alternate_hreflang: '/'
        }
      }
    }
  ]
}

export const REQUIRED_AUTH = [
  '/payment',
  // '/booking',
  // '/processing',
  '/myaccount'
  // '/myaccount/profile',
  // '/myaccount/changepassword',
  // '/myaccount/orders',
  // '/myaccount/payment',
  // '/myaccount/one-ibc-club',
  // '/myaccount/notification',
  // '/myaccount/notification/promotion',
  // '/myaccount/notification/order',
  // '/myaccount/notification/make-payment',
  // '/myaccount/notification/insights'
]

export const NO_AUTH_REQUIRED = ['/login', '/register', '/login/forgot', '/login/enterphonenumber']

export const CHANNEL_TYPE_OTHER = 'Other'

export const CHANNEL_TYPE_PHONE = 'Phone'

export const CHANNEL_TYPE_TEXT = 'Text'

export const KEY_ADS_MAPPING_SEARCH_PARAMS = {
  gclid: 'gclid',
  utm_campaign: 'utm_campaign',
  utm_content: 'utm_content',
  utm_medium: 'utm_medium',
  utm_source: 'utm_source',
  utm_term: 'utm_term',
  cid_account: 'cidAccount',
  id_campaign: 'campaignid',
  id_group_ads: 'adgroupid',
  id_ads: 'idAds',
  keywords: 'keywords'
} as const

export const GROUP_FOOTER_MENU = {
  BLOCK_SECTION_MENU_1: [53, 55],
  BLOCK_SECTION_MENU_2: [60, 65]
}

export enum INSIGHT_TYPE {
  CONTENT_INSIGHT = 'CONTENT_INSIGHT',
  COUNTRY = 'COUNTRY'
}

export const FAQ_TYPE = {
  SERVICE_TYPE: 'SERVICE_TYPE',
  FAQ_DETAIL: 'FAQ_DETAIL'
}

export enum PROMOTION_TYPE {
  CONTENT_PROMOTION = 'CONTENT_PROMOTION',
  COUNTRY = 'COUNTRY'
}

export const PAGE_QUERY_PARAMS = [
  'page',
  'character',
  'status',
  'currency',
  'pageKeyword',
  'search',
  'category',
  'token'
] as const

export const PAYMENT = {
  METHOD: {
    BANK_TRANSFER: 'Bank Transfer',
    CREDIT_CARD: 'Credit Card',
    PAYPAL: 'Paypal'
  },
  STATUS: {
    PENDING: 'Pending',
    SUCCESS: 'Success',
    FAIL: 'Fail'
  },
  TYPE: {
    DEPOSIT: 'Deposit',
    PAYMENT: 'Payment'
  }
}

export const ORDER = {
  STATUS: {
    PENDING: 'Pending',
    SUCCESS: 'Success',
    FAIL: 'Fail'
  }
}

export enum QUERY_STATUS {
  YES = 'Y',
  NO = 'N'
}

export enum QUERY_ORDER_BY {
  INSERT_TIME = 'insert_time',
  ARTICLE_ORDER = 'article_order',
  ARTICLE_INSERT_TIME = 'article_insert_time',
  ARTICLE_UPDATE_TIME = 'article_update_time'
}

export enum IS_MEGA_MENU {
  YES = 'Y',
  NO = 'N'
}

export const CURRENCY = 'currency'

export type QUERY_STATUS_TYPE = 'Y' | 'N'

export enum COOKIES_KEY {
  USER_TOKEN = '__token',
  IP = '__ip',
  COUNTRY = '__country',
  CURRENCY = '__currency',
  IS_REDIRECT = '__is_redirect',
  LANG = '__language',
  LOCATION = '__location',
  GA_CLIENT_ID = '_ga',
  MAKE_PAYMENT_TOKEN = 'make_payment_id'
}

export enum LOCAL_STORAGE_KEY {
  REDIRECT_URL = 'redirect-url'
}

export const BANK_TYPE_PAYMENT_INSTITUTION = 'Payment Institution'

export const DEBUG_MODE = true

export enum TYPE_ID {
  information = 1,
  about_us = 2,
  news_insights = 3,
  products = 4,
  partners = 5,
  faqs = 6
}

export enum TYPE_KEYWORD {
  information = 'information',
  about_us = 'about-us',
  news_insights = 'news',
  products = 'products',
  partners = 'partners',
  faqs = 'faqs'
}

export enum MENU_TYPE {
  custom = 'custom',
  article = 'article',
  page = 'page'
}

export enum NEW_TAB {
  YES = 'Y',
  NO = 'N'
}
