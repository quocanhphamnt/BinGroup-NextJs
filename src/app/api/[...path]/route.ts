import { COOKIES_KEY, KEY_ADS_MAPPING_SEARCH_PARAMS } from '@/constants/generate'
import { useCheckCapCha } from '@/libs/utils/capchaChecker'
import { HttpStatusCode } from '@/libs/utils/httpStatusCode.enum'
import { useFetch } from '@/libs/utils/utilFuncs'
import { NextResponse, userAgent, type NextRequest } from 'next/server'

const KEY_ADS = Object.keys(KEY_ADS_MAPPING_SEARCH_PARAMS)

interface DataAds {
  [key: string]: string | undefined
}

/**
 * Handler for GET requests.
 * @param {NextRequest} request - The incoming request object.
 * @param {Object} params - The parameters object containing the path.
 * @param {string} params.path - The API path.
 * @returns {NextResponse} The response object.
 */
export async function GET(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    // Retrieve headers from the request
    const headersList = request.headers

    // Get language code and location code from headers
    const langCode = headersList.get('language-code') || ''
    const locationCode = headersList.get('location-code') || ''
    const tokenUser = headersList.get('Authorization') || ''
    const isCache = headersList.get('cache') === 'true'

    // Check if language code or location code is missing
    if (!langCode || !locationCode) {
      return NextResponse.json(
        { message: 'Location code or lang code not found' },
        { status: HttpStatusCode.BadRequest }
      )
    }

    // Extract search parameters from request URL
    const { search } = new URL(request.url)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = [...(params.path as any)].join('/')

    // Make API call using useFetch
    const response = await useFetch(`${url}${search}`, langCode, locationCode, 'GET', {}, isCache, {
      Authorization: `Bearer ${tokenUser}`
    })

    // Return the API response
    return NextResponse.json(response, { status: HttpStatusCode.Ok })
  } catch (error) {
    // Throw error if any
    return NextResponse.json({ message: 'Something went wrong' }, { status: HttpStatusCode.BadRequest })
  }
}

/**
 * Handler for DELETE requests.
 * @param {NextRequest} request - The incoming request object.
 * @param {Object} params - The parameters object containing the path.
 * @param {string} params.path - The API path.
 * @returns {NextResponse} The response object.
 */
export async function DELETE(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    // Retrieve headers from the request
    const headersList = request.headers
    // Get language code and location code from headers
    const langCode = headersList.get('language-code') || ''
    const locationCode = headersList.get('location-code') || ''
    const tokenUser = headersList.get('Authorization') || ''
    const isCache = headersList.get('cache') === 'true'

    // Check if language code or location code is missing
    if (!langCode || !locationCode) {
      return NextResponse.json(
        { message: 'Location code or lang code not found' },
        { status: HttpStatusCode.BadRequest }
      )
    }

    // Extract search parameters from request URL
    const { search } = new URL(request.url)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = [...(params.path as any)].join('/')

    // Make API call using useFetch
    const response = await useFetch(`${url}${search}`, langCode, locationCode, 'DELETE', {}, isCache, {
      Authorization: `Bearer ${tokenUser}`
    })

    // Return the API response
    return NextResponse.json(response, { status: HttpStatusCode.Ok })
  } catch (error) {
    // Throw error if any
    return NextResponse.json({ message: 'Something went wrong' }, { status: HttpStatusCode.BadRequest })
  }
}

/**
 * Handler for POST requests.
 * @param {NextRequest} request - The incoming request object.
 * @param {Object} params - The parameters object containing the path.
 * @param {string} params.path - The API path.
 * @returns {NextResponse} The response object.
 */
export async function POST(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    // Retrieve headers from the request
    const headersList = request.headers

    // Get language code and location code from headers
    const langCode = headersList.get('language-code') || ''
    const locationCode = headersList.get('location-code') || ''
    const tokenUser = headersList.get('Authorization') || ''
    const contentType = request.headers.get('Content-Type')
    const gaClientId = request.cookies.get(COOKIES_KEY.GA_CLIENT_ID)?.value || ''
    const ip = request.cookies.get(COOKIES_KEY.IP)?.value || ''
    const { ua } = userAgent(request)

    // Get data Ads
    const dataAds: DataAds = {}
    KEY_ADS.forEach((key) => {
      const value = request.cookies.get(`__data_ads_${key}`)?.value

      if (value) dataAds[key] = value

      dataAds['ip'] = ip
      dataAds['ga_client_id'] = gaClientId
      dataAds['browser'] = ua
    })

    // Check if language code or location code is missing
    if (!langCode || !locationCode) {
      return NextResponse.json({ message: 'Errors' }, { status: HttpStatusCode.BadRequest })
    }

    // Handle Body Data Type
    let bodyData = new FormData()

    const isFormData = contentType && contentType.includes('multipart/form-data')

    if (isFormData) {
      bodyData = await request.formData()

      KEY_ADS.forEach((key) => {
        const value = request.cookies.get(`__data_ads_${key}`)?.value
        bodyData.append(`${dataAds[key]}`, String(value))
      })

      bodyData.append(String('ip'), ip)
      bodyData.append(String('ga_client_id'), gaClientId)
      bodyData.append(String('browser'), ua)
    } else {
      bodyData = await request.json()
    }

    const gCaptcha =
      (bodyData as typeof bodyData & { gRecaptchaToken?: string })?.gRecaptchaToken || bodyData?.get('gRecaptchaToken')

    if (!gCaptcha) {
      return NextResponse.json(
        { common_error: 'ReCAPTCHA validation failed. Please try again later.' },
        { status: HttpStatusCode.Ok }
      )
    }

    // Verify Recaptcha
    const isValidCaptcha = await useCheckCapCha(String(gCaptcha))

    if (!isValidCaptcha?.tokenProperties?.valid) {
      return NextResponse.json(
        { common_error: 'ReCAPTCHA validation failed. Please try again later.' },
        { status: HttpStatusCode.Ok }
      )
    }

    // Extract search parameters from request URL
    const { search } = new URL(request.url)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = [...(params.path as any)].join('/')
    const requestBody = isFormData ? bodyData : { ...bodyData, ...dataAds }

    // Make API call using useFetch
    const response = await useFetch(
      `${url}${search}`,
      langCode,
      locationCode,
      'POST',
      requestBody,
      false,
      { Authorization: `Bearer ${tokenUser}`, isForm: isFormData },
      {}
    )

    // Return the API response
    return NextResponse.json(response, { status: response?.statusCode })
  } catch (error) {
    return NextResponse.json({ common_error: 'Something went wrong' }, { status: HttpStatusCode.BadRequest })
  }
}

/**
 * Handler for PUT requests.
 * @param {NextRequest} request - The incoming request object.
 * @param {Object} params - The parameters object containing the path.
 * @param {string} params.path - The API path.
 * @returns {NextResponse} The response object.
 */
export async function PUT(request: NextRequest, { params }: { params: { path: string } }) {
  try {
    // Retrieve headers from the request
    const headersList = request.headers
    // Get language code and location code from headers
    const langCode = headersList.get('language-code') || ''
    const locationCode = headersList.get('location-code') || ''
    const tokenUser = headersList.get('Authorization') || ''

    // Get data Ads
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataAds = {} as any
    KEY_ADS.forEach((key) => {
      const value = request.cookies.get(`__data_ads_${key}`)?.value

      if (value) dataAds[key] = value
    })

    // Check if language code or location code is missing
    if (!langCode || !locationCode) {
      return NextResponse.json({ message: 'Errors' }, { status: HttpStatusCode.BadRequest })
    }

    // Parse request body
    const bodyData = await request.json()

    if (!bodyData?.gRecaptchaToken) {
      return NextResponse.json(
        { common_error: 'ReCAPTCHA validation failed. Please try again later.' },
        { status: HttpStatusCode.Ok }
      )
    }

    // Verify Recaptcha
    const isValidCaptcha = await useCheckCapCha(bodyData?.gRecaptchaToken)

    if (!isValidCaptcha?.tokenProperties?.valid) {
      return NextResponse.json(
        { common_error: 'ReCAPTCHA validation failed. Please try again later.' },
        { status: HttpStatusCode.Ok }
      )
    }

    // Extract search parameters from request URL
    const { search } = new URL(request.url)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = [...(params.path as any)].join('/')

    // Make API call using useFetch
    const response = await useFetch(
      `${url}${search}`,
      langCode,
      locationCode,
      'PUT',
      { ...bodyData, ...dataAds },
      false,
      { Authorization: `Bearer ${tokenUser}` },
      {}
    )

    // Return the API response
    return NextResponse.json(response, { status: HttpStatusCode.Ok })
  } catch (error) {
    return NextResponse.json({ common_error: 'Something went wrong' }, { status: HttpStatusCode.BadRequest })
  }
}
