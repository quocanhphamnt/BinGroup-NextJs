/* eslint-disable react/jsx-no-undef */
'use client'

import { useMounted } from '@/libs/hooks'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { FieldValues, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'
import type { DropdownIndicatorProps, GroupBase, InputProps, SelectInstance, StylesConfig } from 'react-select'
import { default as Select, components } from 'react-select'

export interface SelectOptionProps {
  value: string | number
  label: string | number
  icon?: string
  state_count?: number
}

export type OptionType = SelectOptionProps

export interface GroupSelectOptions {
  label: string
  options: {
    label: string
    value: number
  }[]
}

type InputSelectOptions = SelectOptionProps[] | GroupSelectOptions[] | undefined

interface InputSelectProps {
  option: InputSelectOptions
  isSearchable?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  name: string
  nameLabel?: string
  className?: string
  classNamePrefix?: string
  onSelect?: (value: SelectOptionProps) => void
  classNameLabel?: string
  id: string
  isRequired?: boolean
  classNameError?: string
  placeholder?: string
  defaultValue?: {
    value: string
    label: string
  }
  controlStyle?: StylesConfig
  formatGroupLabel?: ({
    label,
    options
  }: {
    label: string
    options: { label: string; value: number }[]
  }) => React.ReactNode
}

export default function InputSelect<T extends FieldValues>(props: UseControllerProps<T> & InputSelectProps) {
  const selectInputRef = useRef<SelectInstance<InputSelectOptions, false, GroupBase<InputSelectOptions>>>(null)

  const {
    option,
    isLoading,
    isDisabled,
    isSearchable,
    name,
    nameLabel,
    className,
    classNamePrefix,
    classNameLabel,
    id,
    isRequired,
    control,
    onSelect,
    placeholder,
    defaultValue,
    classNameError = 'text-12 font-normal text-red-1 mt-1 leading-[18px]',
    controlStyle
  } = props

  const { field, fieldState } = useController({
    name: name,
    control,
    defaultValue: defaultValue
  })

  // Handle Hook Form Reset
  useEffect(() => {
    if (selectInputRef.current && field.value === undefined) {
      selectInputRef.current.clearValue()
    }
  }, [field.value])

  const loadIcon = (data: SelectOptionProps) => {
    if (!data.icon)
      return {
        margin: '0',
        padding: '0'
      }

    return {
      alignItems: 'center',
      display: 'flex',

      ':before': {
        background: `url(${data.icon}) no-repeat 0 0 / contain`,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 14,
        width: 20,
        flexShrink: 0
      }
    }
  }

  const customStyles: StylesConfig = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      height: '40px',
      border: fieldState.error ? '1px solid #EB001B' : '1px solid #C1C1C1',
      ':hover': {
        border: fieldState.error ? '1px solid #EB001B' : '1px solid #C1C1C1'
      },
      boxShadow: 'none'
    }),
    dropdownIndicator: (provided, { selectProps }) => ({
      ...provided,
      transform: selectProps.menuIsOpen ? 'rotate(180deg)' : undefined,
      transition: 'transform 0.2s ease-in-out',
      color: '#777777',
      fill: '#777777'
    }),
    menu: (provided) => ({
      ...provided,
      margin: '0',
      boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.10)',
      zIndex: 9999
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '12px',
      overflowX: 'hidden',
      boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.10)',
      borderRadius: '4px'
    }),
    option: (provided, { isSelected, data }) => {
      return {
        ...provided,
        padding: '6px 12px',
        color: isSelected ? '#008291' : '#333',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '24px',
        borderRadius: '2px',
        marginLeft: (data as { isChildren: boolean }).isChildren ? '12px' : '0',
        backgroundColor: isSelected ? '#F2F9F9' : 'white',
        ':hover': {
          backgroundColor: '#F2F9F9',
          cursor: 'pointer',
          color: '#008291',
          fontWeight: '500'
        }
      }
    },
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 10px',
      margin: '0'
    }),
    singleValue: (styles, { data }) => ({ ...styles, ...loadIcon(data as SelectOptionProps) }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: '#333333',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px'
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999999',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px'
    }),
    ...controlStyle
  }

  const onChange = (selectedOption: unknown | SelectOptionProps) => {
    field.onChange(selectedOption)
    onSelect && onSelect(selectedOption as SelectOptionProps)
  }

  const isMounted = useMounted()

  useEffect(() => {
    if (defaultValue) {
      onChange(defaultValue)
    }
  }, [defaultValue])

  return (
    <>
      <div className='relative text-14'>
        <div className='relative flex flex-col gap-1.5'>
          {nameLabel && (
            <label
              htmlFor={id}
              className={`label-primary ${classNameLabel ? classNameLabel : ''} ${isRequired ? 'label-required' : ''} text-14 font-medium leading-[20px] text-black-3`}
            >
              {nameLabel}
            </label>
          )}
          {isMounted && (
            <Select
              className={`${className ? className : ''} `}
              styles={customStyles}
              classNamePrefix={`${classNamePrefix ? classNamePrefix : ''}`}
              defaultValue={defaultValue}
              placeholder={placeholder}
              isDisabled={isDisabled}
              isLoading={isLoading}
              isSearchable={isSearchable}
              name={name}
              options={option}
              inputId={id}
              required={isRequired}
              onChange={(e) => onChange(e)}
              value={field.value}
              components={{ DropdownIndicator, Option: IconOption, Input }}
              onBlur={() => field && field.onBlur()}
              ref={selectInputRef as never}
              menuShouldScrollIntoView={true}
              // defaultMenuIsOpen={true}
            />
          )}
        </div>
        {fieldState.error && (
          <div
            className={`input-error ${classNameError ? classNameError : ''}`}
            dangerouslySetInnerHTML={{ __html: fieldState.error.message as string }}
          ></div>
        )}
      </div>
    </>
  )
}

const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
        <path
          d='M14.5336 4.82468L13.8656 4.13751C13.7766 4.04574 13.6741 4 13.5582 4C13.4426 4 13.3401 4.04574 13.2511 4.13751L8.00023 9.53951L2.74961 4.13765C2.66056 4.04589 2.55808 4.00015 2.44231 4.00015C2.32649 4.00015 2.22401 4.04589 2.13501 4.13765L1.46714 4.82487C1.37795 4.91644 1.3335 5.02188 1.3335 5.14104C1.3335 5.2601 1.37809 5.36554 1.46714 5.45711L7.69293 11.8626C7.78193 11.9542 7.88446 12 8.00023 12C8.116 12 8.21835 11.9542 8.3073 11.8626L14.5336 5.45711C14.6226 5.36549 14.6668 5.26005 14.6668 5.14104C14.6668 5.02188 14.6226 4.91644 14.5336 4.82468Z'
          fill='#666666'
        />
      </svg>
    </components.DropdownIndicator>
  )
}

const Input: React.FC<InputProps> = (props) => <components.Input {...props} autoComplete='off' />

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconOption: React.FC<any> = (props) => {
  return (
    <components.Option {...props} className='!flex items-center justify-start gap-2'>
      {props.data.icon && (
        <Image
          width={20}
          height={14}
          style={{ width: '20px' }}
          src={props.data.icon || '/'}
          alt={props.data.label || ''}
          title={props.data.label}
        />
      )}
      {props.data.label}
    </components.Option>
  )
}
