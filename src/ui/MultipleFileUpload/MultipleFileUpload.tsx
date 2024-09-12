'use client'

import React, { useRef } from 'react'
import type { ArrayPath, FieldValues, Path, UseControllerProps, UseFormSetError } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'

interface InputFileProps {
  nameButton?: string
  errorMessage?: string
  classNameError?: string
  nameLabel?: string
  name: string
  limit?: number
  limitMessage?: string
  t: Record<string, string>
}

export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

export const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

export default function MultipleFileUpload<T extends FieldValues>({
  name,
  errorMessage,
  nameButton,
  classNameError = 'mt-1 lg:min-h-[1.25rem] text-12 lg:text-14 text-red-1',
  nameLabel,
  t,
  control,
  setError,
  limitMessage,
  limit = 3
}: UseControllerProps<T> & { setError?: UseFormSetError<T> } & InputFileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { fields, append, remove } = useFieldArray({ control, name: name as ArrayPath<T> })

  const handleAddDocuments = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const uploadedFiles = Array.from(event.target.files)

    const files: { file: File }[] = uploadedFiles.map((file) => ({ file }))

    if (fields.length + files.length > limit) {
      const errorPath = 'files' as Path<T>

      setError &&
        setError(errorPath, { message: t?.api_error_max_file?.replace('|||LIMIT_FILE|||', limit?.toString()) })

      return
    }

    append(files as unknown as typeof fields)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onAddDocuments = () => fileInputRef.current?.click()

  return (
    <>
      <div className='flex items-center gap-3'>
        <label
          className='text-14 leading-[20px] font-medium text-black-3'
          dangerouslySetInnerHTML={{ __html: nameLabel ?? '' }}
        />
        <div className={`relative ${fields?.length === 3 && 'hidden'}`}>
          <input
            className='absolute h-full w-full cursor-pointer opacity-0 -z-[1]'
            type='file'
            accept={Object.keys(SUPPORTED_FORMATS).join(', ')}
            ref={fileInputRef}
            onChange={handleAddDocuments}
            multiple
            max={limit - fields.length}
          />
          <button
            className='flex w-full items-center justify-center text-14 leading-[20px] font-normal bg-gray-3 px-3 py-0.5 cursor-pointer text-black-3'
            type='button'
            onClick={onAddDocuments}
          >
            {nameButton}
          </button>
        </div>
      </div>

      {fields?.length > 0 && (
        <div className='mt-2 border-t border-gray-6 text-gray-2'>
          {fields?.map((field, index) => {
            return (
              <div key={index} className='mt-2 flex items-center gap-3'>
                <p className='text-12 !mb-0 text-black-3'>
                  {(field as unknown as { file: { name: string } }).file.name}
                </p>
                <button
                  onClick={() => remove(index)}
                  type='button'
                  className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-8'
                >
                  <svg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M11.1334 0.866687C10.8667 0.60002 10.4667 0.60002 10.2001 0.866687L6.00008 5.06669L1.80008 0.866687C1.53341 0.60002 1.13341 0.60002 0.866748 0.866687C0.600081 1.13335 0.600081 1.53335 0.866748 1.80002L5.06675 6.00002L0.866748 10.2C0.600081 10.4667 0.600081 10.8667 0.866748 11.1334C1.00008 11.2667 1.13341 11.3334 1.33341 11.3334C1.53341 11.3334 1.66675 11.2667 1.80008 11.1334L6.00008 6.93335L10.2001 11.1334C10.3334 11.2667 10.5334 11.3334 10.6667 11.3334C10.8001 11.3334 11.0001 11.2667 11.1334 11.1334C11.4001 10.8667 11.4001 10.4667 11.1334 10.2L6.93341 6.00002L11.1334 1.80002C11.4001 1.53335 11.4001 1.13335 11.1334 0.866687Z'
                      fill='#777777'
                    />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className='mt-2'>
        {errorMessage && <div className={`input-error ${classNameError ? classNameError : ''}`}>{errorMessage}</div>}
        <p className='text-14 font-normal leading-[20px] text-black-3'>
          (*.jpg, *.jpeg, *.png, *.gif, *.bmp, *.pdf, *.txt, *.doc, *.docx, *.xls, *.xlsx,
          <strong className='ml-1 font-medium'> &lt;= {limitMessage}</strong>)
        </p>
      </div>
    </>
  )
}
