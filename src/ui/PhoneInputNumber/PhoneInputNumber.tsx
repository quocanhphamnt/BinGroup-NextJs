'use client'

import { COOKIES_KEY } from '@/constants/generate'
import { getCookie } from 'cookies-next'
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css'
import 'intl-tel-input/build/js/utils.js' // Importing utils.js directly
import type { InputHTMLAttributes } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { FieldValues, UseControllerProps, UseFormSetError } from 'react-hook-form'
import { useController } from 'react-hook-form'
import './style.css'

enum validationError {
  IS_POSSIBLE = 0,
  INVALID_COUNTRY_CODE = 1,
  TOO_SHORT = 2,
  TOO_LONG = 3,
  NOT_A_NUMBER = 4
}

const validationErrorMapping: { [key: number]: string } = {
  [validationError.IS_POSSIBLE]: 'IS_POSSIBLE',
  [validationError.INVALID_COUNTRY_CODE]: 'INVALID_COUNTRY_CODE',
  [validationError.TOO_SHORT]: 'TOO_SHORT',
  [validationError.TOO_LONG]: 'TOO_LONG',
  [validationError.NOT_A_NUMBER]: 'NOT_A_NUMBER'
}

interface PhoneInputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  name: string
  nameLabel?: string
  classNameLabel?: string
  className?: string
  classSpace?: string
  id?: string
  defaultValue?: string
  countryCodeSelected?: string
}

export default function PhoneInputNumber<T extends FieldValues>({
  id,
  className,
  control,
  setError,
  nameLabel,
  classNameInput = '',
  classSpace,
  countryCodeSelected,
  name,
  classNameLabel,
  ...restParams
}: UseControllerProps<T> & {
  setError: UseFormSetError<T>
} & PhoneInputNumberProps) {
  const phoneRef = useRef<intlTelInput.Plugin | null>(null)
  const { field, fieldState } = useController({ name, control })
  const [countryCode, setCountryCode] = useState<string | undefined>(undefined)

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>(id ? `#${id}` : '#signup-phone')

    if (input) {
      // Initialize phone input
      phoneRef.current = intlTelInput(input, {
        separateDialCode: true,
        initialCountry: countryCode || countryCodeSelected || getCookie(COOKIES_KEY.COUNTRY)?.toLowerCase(),
        preferredCountries: [countryCodeSelected || getCookie(COOKIES_KEY.COUNTRY)?.toLowerCase()] as string[]
      })

      if (field.value) {
        phoneRef.current.setNumber(field.value)

        field.onChange(field.value)
      }

      setCountryCode('')

      const handlePhoneNumber = () => {
        let inputNumber = phoneRef.current?.getNumber() || ''

        const dialCode = phoneRef.current?.getSelectedCountryData()?.dialCode || ''

        setCountryCode(phoneRef.current?.getSelectedCountryData()?.iso2)

        // Required is number
        if (inputNumber.startsWith(`+${dialCode}`)) {
          inputNumber = inputNumber.replace(`+${dialCode}`, '')

          phoneRef.current?.setNumber(inputNumber)

          field.onChange(`+${dialCode}${inputNumber}`)
        } else {
          field.onChange(inputNumber)
        }

        const error = phoneRef?.current?.getValidationError()

        // Required is possible
        if (error !== intlTelInputUtils.validationError.IS_POSSIBLE) {
          return setError(field.name, {
            type: validationErrorMapping[error || intlTelInputUtils.validationError.NOT_A_NUMBER],
            message: 'Please enter a valid number.'
          })
        }

        if (!inputNumber.match(/^(\+)?\d+$/)) {
          return setError(field.name, {
            type: validationErrorMapping[validationError.NOT_A_NUMBER],
            message: 'Please enter a valid number.'
          })
        }
      }

      input.addEventListener('blur', handlePhoneNumber)
      input.addEventListener('change', handlePhoneNumber)

      return () => {
        phoneRef.current?.destroy()
        input.removeEventListener('blur', handlePhoneNumber)
        input.removeEventListener('change', handlePhoneNumber)
      }
    }
  }, [field.value])

  return (
    <div className={className} data-te-input-wrapper-init>
      <div className={`relative flex flex-col-reverse gap-1.5 ${classSpace}`}>
        <input
          className={`${fieldState?.error && 'border-red-1'} ${
            classNameInput ? classNameInput : ''
          }  text-black-6 border-gray-11 h-11 rounded border border-gray-1 p-3 text-14 placeholder:text-14 placeholder:text-[#999999]  placeholder:leading-[20px] placeholder:font-normal w-full appearance-none focus:border-primary focus:outline-none focus:ring-0 `}
          id={id ? id : 'signup-phone'}
          maxLength={15}
          pattern='[0-9]*'
          formNoValidate
          onKeyPress={(event) => {
            if (!/[0-9+]/.test(event.key)) {
              event.preventDefault()
            }
          }}
          onPaste={(event) => {
            const paste = (event.clipboardData || window.clipboardData).getData('text')

            if (!/^\+?\d+$/.test(paste)) {
              event.preventDefault()
            }
          }}
          {...restParams}
        />
        <label
          htmlFor={id ? id : 'signup-phone'}
          className={`${classNameLabel && classNameLabel} ${restParams.required && 'label-required'} text-14 font-medium leading-[20px] text-black-3`}
        >
          {nameLabel}
        </label>
      </div>
      {fieldState?.error && (
        <div
          className='text-12 font-normal text-red-1 mt-1 leading-[18px]'
          dangerouslySetInnerHTML={{ __html: String(fieldState?.error.message) }}
        ></div>
      )}
    </div>
  )
}
