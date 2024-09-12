import { HttpStatusCode } from '@/libs/utils/httpStatusCode.enum'
import type { ApiResponse } from '@/types/common'

enum ErrorMessages {
  unauthorized = 'Unauthorized access detected',
  NotFound = 'Data not found'
}

export function extractErrors<T>(
  responseData: ApiResponse<T> | undefined
): (Record<keyof typeof ErrorMessages, string> & Record<string, string>) | null {
  let errors: Record<string, string> | null = {}

  if (!responseData) return null

  const commonMessage = responseData.message
  const status = responseData.success

  // Handle Responses Get Errors
  switch (Number(responseData.statusCode)) {
    case HttpStatusCode.Unauthorized:
      errors['unauthorized'] = commonMessage || ErrorMessages.unauthorized

      break

    case HttpStatusCode.NotFound:
      errors['NotFound'] = commonMessage || ErrorMessages.NotFound

      break

    case HttpStatusCode.UnprocessableEntity:
      for (const key in responseData.validator) {
        if (Object.prototype.hasOwnProperty.call(responseData.validator, key)) {
          errors[key] = responseData.validator[key][0]
        }
      }

      break

    default:
      errors = null

      break
  }

  if (!status && errors && commonMessage) errors['error'] = commonMessage as string

  return errors as Record<keyof typeof ErrorMessages, string> & Record<string, string>
}
