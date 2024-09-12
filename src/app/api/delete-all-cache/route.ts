import { NEXT_PRIVATE_BASE_API_PUBLIC_KEY } from '@/constants/env'
import { HttpStatusCode } from '@/libs/utils/httpStatusCode.enum'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Handler for DELETE requests to clear cache.
 * @returns {NextResponse} The response object.
 */
export async function DELETE() {
  // Retrieve headers from the request
  const headersList = headers()
  // Get API public key from headers
  const apiPublicKey = headersList.get('api-public-key')

  // Check if API public key is valid
  if (apiPublicKey !== NEXT_PRIVATE_BASE_API_PUBLIC_KEY) {
    return NextResponse.json(
      { status_code: HttpStatusCode.BadRequest, message: 'Public key invalid' },
      { status: HttpStatusCode.BadRequest }
    )
  }

  // Clear cache by revalidating all cache tags
  revalidateTag('all')

  // Return success response
  return NextResponse.json(
    {
      status_code: HttpStatusCode.Ok,
      message: 'Cache cleared successfully!'
    },
    { status: HttpStatusCode.Ok }
  )
}
