import { formatNumber } from '@/libs/utils/utilFuncs'
import type { ChangeEvent, InputHTMLAttributes } from 'react'
import { forwardRef, useState } from 'react'
import HideIcon from '../icon/HideIcon'
import ViewIcon from '../icon/ViewIcon'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  id?: string
  nameLabel?: string
  classNameLabel?: string
}

enum INPUT_TYPES {
  text = 'text',
  password = 'password',
  email = 'email',
  number = 'number',
  tel = 'tel'
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    errorMessage,
    className,
    classNameInput,
    classNameError = 'text-12 font-normal leading-[18px] text-red-1 mt-1',
    id,
    nameLabel,
    classNameLabel,
    ...restParams
  }: InputProps,
  ref
) {
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => setVisible((prev) => !prev)

  const handleType = () => {
    if (restParams.type === INPUT_TYPES.password) {
      return visible ? INPUT_TYPES.text : INPUT_TYPES.password
    }

    return restParams.type
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/ {2,}/g, ' ')
    const formattedValue = formatNumber(rawValue)
    e.target.value = restParams.type === 'number' || restParams.type === 'tel' ? formattedValue : rawValue
  }

  return (
    <div className={className}>
      <div className={`${restParams.type === INPUT_TYPES.password && 'relative'} flex flex-col-reverse gap-1.5`}>
        <input
          ref={ref}
          {...restParams}
          onChange={(e) => {
            handleChange(e)
            restParams?.onChange && restParams?.onChange(e)
          }}
          type={handleType()}
          className={`${
            classNameInput ? classNameInput : ''
          } text-black-6 border-gray-11 h-11 w-full appearance-none rounded border border-gray-1 px-3 text-14 placeholder:text-14 placeholder:text-[#999999] placeholder:leading-[20px] placeholder:font-normal focus:border-primary focus:outline-none focus:ring-0 ${errorMessage ? 'border-red-1' : ''}`}
        />

        {nameLabel && (
          <label
            htmlFor={id}
            className={`${classNameLabel ? classNameLabel : ''} ${!nameLabel && 'hidden'} ${restParams.required ? 'label-required' : ''} text-14 font-medium leading-[20px] text-black-3`}
            dangerouslySetInnerHTML={{ __html: nameLabel || '' }}
          ></label>
        )}
        <style jsx>
          {`
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
              /* display: none; <- Crashes Chrome on hover */
              -webkit-appearance: none;
              margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
            }

            input[type='number'] {
              -moz-appearance: textfield; /* Firefox */
            }
          `}
        </style>
      </div>

      {restParams.type === INPUT_TYPES.password &&
        (visible ? <ViewIcon onClick={toggleVisible} /> : <HideIcon onClick={toggleVisible} />)}

      {errorMessage && <div className={classNameError} dangerouslySetInnerHTML={{ __html: errorMessage }}></div>}
    </div>
  )
})

export default Input
