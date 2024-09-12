/* eslint-disable @typescript-eslint/no-explicit-any */

import { NEXT_PUBLIC_RECAPTCHA_SITE_KEY } from '@/constants/env'

declare const grecaptcha: any

export const executeRecaptcha = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    grecaptcha.enterprise.ready(async () => {
      try {
        const token = await grecaptcha.enterprise.execute(NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'LOGIN' })
        resolve(token)
      } catch (error) {
        reject(error)
      }
    })
  })
}
