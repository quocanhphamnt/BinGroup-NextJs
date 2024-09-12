import { NEXT_PUBLIC_ENCRYPT_KEY } from '@/constants/env'
import CryptoJS from 'crypto-js'
import { parseJSON } from './utilFuncs'

export function useEncrypt(value: string, secret: string = NEXT_PUBLIC_ENCRYPT_KEY): string | null {
  if (!secret || typeof secret !== 'string') {
    return null
  }

  if (value == null) {
    return null
  }

  try {
    return encryptWithNoErrors(secret, value)
  } catch (error) {
    return null
  }
}

function encryptWithNoErrors(secret: string, value: string): string {
  return CryptoJS.AES.encrypt(value, secret).toString()
}

export function useDecrypt(value: string | null, secret: string = NEXT_PUBLIC_ENCRYPT_KEY): string | null {
  if (!secret || typeof secret !== 'string') {
    return null
  }

  if (value == null) {
    return null
  }

  try {
    return decryptWithNoErrors(secret, value)
  } catch (error) {
    return null
  }
}

function decryptWithNoErrors(secret: string, value: string): string {
  const decrypted = CryptoJS.AES.decrypt(value, secret)

  return decrypted.toString(CryptoJS.enc.Utf8)
}

export const useModifyObject = <T>(obj: T): T => {
  if (process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === 'OFF') return obj

  try {
    if (obj === null || obj === undefined || obj === '' || obj === 0) {
      return obj as T
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => useModifyObject(item)) as T
    } else if (typeof obj === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modifiedObject: Record<string, any> = {}

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key]
          modifiedObject[CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(key))] = useModifyObject(value)
        }
      }

      return modifiedObject as T
    }

    return useEncrypt(obj.toString(), NEXT_PUBLIC_ENCRYPT_KEY) as T
  } catch (error) {
    return obj
  }
}

export const useReverseModifyObject = <T>(obj: T): T | undefined => {
  if (process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === 'OFF') return obj

  try {
    if (obj === null || obj === undefined || obj === '' || obj === 0) {
      return obj as T
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => useReverseModifyObject(item)) as T
    } else if (typeof obj === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reversedObject: Record<string, any> = {}

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key]
          const reversedKey = CryptoJS.enc.Base64.parse(key).toString(CryptoJS.enc.Utf8)
          reversedObject[reversedKey] = useReverseModifyObject(value)
        }
      }

      return reversedObject as T
    }

    if (typeof obj === 'string') {
      const result = useDecrypt(obj) as T

      if (result === 'true') return true as T

      if (result === 'false') return false as T

      if (result === 'null') return null as T

      if (result === 'undefined') return undefined as T

      return result
    }
  } catch (error) {
    return obj
  }
}

export const useEncryptBase64 = (value: string) => {
  if (process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === 'OFF') return value

  try {
    return btoa(useEncrypt(value) as string)
  } catch (error) {
    return value
  }
}

export const useDecryptBase64 = (value: string) => {
  if (process.env.NEXT_PUBLIC_ENABLE_ENCRYPT === 'OFF') return value

  try {
    const decodeBase64 = atob(value)
    const decodeValues = useDecrypt(decodeBase64)

    return parseJSON(decodeValues as string)
  } catch (error) {
    return value
  }
}
