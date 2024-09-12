import {
  NEXT_PUBLIC_RECAPTCHA_PROJECT_ID,
  NEXT_PUBLIC_RECAPTCHA_SECRET_KEY,
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY
} from '@/constants/env'
import { DEVELOPMENT } from '@/constants/generate'

/**
 * Check captcha token
 *
 * @param {string} capChaToken - The captcha token to check
 * @returns {Promise<{tokenProperties: {valid: boolean}} | null>} - The result of captcha token check
 */
export const useCheckCapCha = async (capChaToken: string) => {
  // If in development mode or no capChaToken provided, return valid = true
  if (process.env.NODE_ENV === DEVELOPMENT || !capChaToken) {
    return {
      tokenProperties: {
        valid: true
      }
    }
  }

  try {
    const data = {
      event: {
        token: capChaToken,
        expectedAction: 'USER_ACTION',
        siteKey: NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      }
    }

    // Send captcha check request to Google ReCaptcha Enterprise API
    return fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${NEXT_PUBLIC_RECAPTCHA_PROJECT_ID}/assessments?key=${NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        cache: 'no-store'
      }
    )
      .then((reCaptchaRes) => reCaptchaRes.json())
      .then((reCaptchaRes) => {
        if (reCaptchaRes) return reCaptchaRes ?? null
      })
  } catch (err) {
    // Handle errors and throw error message
    if (err instanceof Error) {
      throw new Error(`Error checking captcha: ${err.message}`)
    } else {
      throw new Error(`Unknown error occurred`)
    }
  }
}
