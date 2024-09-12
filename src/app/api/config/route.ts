import { NEXT_PUBLIC_BASE_API_URL } from '@/constants/env'
import { HttpStatusCode } from '@/libs/utils/httpStatusCode.enum'
import { useFetch } from '@/libs/utils/utilFuncs'
import type { ApiResponse, ConfigItem } from '@/types/common'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Handle the GET request to fetch configuration items by language and location.
 * @param request - The Next.js request object.
 * @returns NextResponse - The response with the filtered configuration items.
 */
export async function GET(request: NextRequest) {
  // Extract query parameters from the URL
  const searchParams = new URLSearchParams(request.nextUrl.search)
  const headersList = request.headers
  const langCode = headersList.get('language-code') || ''
  const locationCode = headersList.get('location-code') || ''
  const tokenUser = headersList.get('Authorization') || ''

  // Check if language code or location code is missing
  if (!langCode || !locationCode) {
    return NextResponse.json({ message: `Lang code or location code not found.` }, { status: HttpStatusCode.NotFound })
  }

  // Extract the key from the query parameters and split it
  const key = searchParams.get('key')
  const search = key?.split('-')

  // Fetch the configuration data based on language and location
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonResponseConfig = await useFetch<ApiResponse<ConfigItem[]>>(
    `${NEXT_PUBLIC_BASE_API_URL}/config/get-by-lang`,
    langCode,
    locationCode,
    'GET',
    {},
    true,
    {
      Authorization: `Bearer ${tokenUser}`
    }
  )

  // Check if configuration data is not found
  if (!jsonResponseConfig.success) {
    return NextResponse.json({ message: `Config not found.` }, { status: HttpStatusCode.NotFound })
  }

  // Create a set from the search array
  const setSearch = new Set(search)

  const filteredItems: ConfigItem[] = []

  if (Array.isArray(jsonResponseConfig?.data)) {
    for (const item of jsonResponseConfig.data) {
      if (setSearch.has(item.config_key)) {
        filteredItems.push({
          config_key: item.config_key,
          config_content: String(item.config_content)
        })
      }
    }
  }

  // Return the filtered configuration items in the response
  return NextResponse.json({ success: true, data: filteredItems }, { status: HttpStatusCode.Ok })
}
