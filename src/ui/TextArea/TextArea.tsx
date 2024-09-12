import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import './style.css'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  id?: string
  nameLabel?: string
  classNameLabel?: string
}

const TextAreaPro = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    errorMessage,
    className,
    classNameInput,
    classNameError = 'text-12 font-normal text-red-1 mt-1 leading-[18px]',
    id,
    nameLabel,
    classNameLabel,
    ...restParams
  }: TextAreaProps,
  ref
) {
  return (
    <div className={className}>
      <div className='flex flex-col-reverse gap-1.5'>
        <textarea
          className={`${
            classNameInput ? classNameInput : ''
          } style-scroll text-black-6 border-gray-11 px-3 text-black-6 border-gray-11 min-h-[86px] rounded border border-gray-1 p-3 text-14 placeholder:text-14 placeholder:text-[#999999]  placeholder:leading-[20px] placeholder:font-normal w-full appearance-none  focus:border-primary focus:outline-none focus:ring-0 ${
            errorMessage ? 'border-red-1' : ''
          }`}
          ref={ref}
          {...restParams}
          rows={2}
        />

        <label
          htmlFor={id}
          className={`${classNameLabel ? classNameLabel : ''} ${!nameLabel && 'hidden'} ${restParams.required ? 'label-required ' : ''} text-14 font-medium leading-[20px] text-black-3`}
        >
          {nameLabel}
        </label>
      </div>

      {errorMessage && <div className={classNameError} dangerouslySetInnerHTML={{ __html: errorMessage }}></div>}
    </div>
  )
})

export default TextAreaPro
