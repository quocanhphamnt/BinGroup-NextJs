/* eslint-disable @typescript-eslint/no-explicit-any */
// Example Props Data
// ----------------------------------------------------------------------
/*const data = [
  {
    name: 'Zalo',
    value: 'Zalo',
    id: 1,
    icon: 'https://d1ubwt7z1ubyyw.cloudfront.net/uploads/icon-zalo-1622857821.svg'
  },
  {
    name: 'Facebook',
    value: 'Facebook',
    id: 2,
    icon: 'https://d1ubwt7z1ubyyw.cloudfront.net/uploads/icon-zalo-1622857821.svg'
  }

  // Example Props Config Field Name Data
  // ----------------------------------------------------------------------
  const selectFieldName = {
    name: 'country_name',
    value: 'country_code',
    id: 'country_id'
  }
]*/
import useDisplay from '@/libs/hooks/useDisplay'
import useGlobalStore from '@/libs/store/client/globalStore'
import { _map } from '@/libs/utils/utilFuncs'
import Image from 'next/image'
import type { KeyboardEvent } from 'react'
import { useEffect, useRef, useState, useTransition } from 'react'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'
import ModalSelectMobile from '../ModalSelectMobile'
import ArrowDownIcon from '../icon/ArrowDownIcon'

interface SelectProps {
  data: Array<any>
  name: string
  placeholder: string
  className?: string
  control?: Control<any>
  onChange?: (value: any) => void
  defaultValue?: object | string | number | CustomObject
  selectFieldName: FieldNameSelect
  onBlur?: () => void
  errorMessage?: string
  maxLength?: number
  isSearchInput?: boolean
  isRequired?: boolean
  nameLabel?: string
  heightListOption?: string
  isShowInputSearch?: boolean
}

export default function Select(props: SelectProps) {
  const {
    data,
    control,
    name,
    placeholder,
    className = '',
    selectFieldName,
    defaultValue = '',
    onChange,
    onBlur,
    errorMessage,
    maxLength,
    nameLabel,
    isSearchInput = true,
    isRequired = true,
    isShowInputSearch = true,
    heightListOption = 'max-h-[360px]',
    ...res
  } = props
  const isMobile = useDisplay(768)
  const [active, setActive] = useState(false)
  const [inputNameValue, setInputNameValue] = useState('')
  const [filterData, setFilterData] = useState(data)
  const [isSearch, setIsSearch] = useState(false)
  const [, startTransition] = useTransition()
  const [modalIsActive, setModalIsActive] = useState(false)

  useEffect(() => {
    setFilterData(data)
  }, [data])

  const { updateGlobalStore } = useGlobalStore()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    name: itemName,
    id: itemId,
    icon: itemIcon,
    value: itemValue
  } = selectFieldName || { name: 'name', value: 'value', id: 'id', icon: 'icon' }

  const defaultValueIsObject = typeof defaultValue === 'object' && defaultValue !== null

  const getDefaultValueFromCode =
    !defaultValueIsObject && defaultValue && data?.find((item) => itemValue && item[itemValue] === defaultValue)

  const { field, fieldState } = (control &&
    useController({
      name,
      control,
      defaultValue: getDefaultValueFromCode || defaultValue
    })) || { field: null, fieldState: null }

  const handleItemClick = (item: SelectItemDropdown | Record<string, string>) => {
    setInputNameValue(item && (item[itemName] as string))
    field && field.onChange(item)
    field && field.onBlur()

    handleCloseModal()
    onChange && onChange(item)
  }

  useEffect(() => {
    return () => {
      // Cleanup function to clear the input value
      setInputNameValue('')
    }
  }, [])

  useEffect(() => {
    if (getDefaultValueFromCode) {
      field?.onChange(getDefaultValueFromCode)
      updateGlobalStore('detailDefaultCountry', getDefaultValueFromCode)
    }
  }, [getDefaultValueFromCode])

  const handleCloseModal = () => {
    field && field.onBlur()
    setModalIsActive(false)
  }

  useEffect(() => {
    const handleOutsideClick = () => {
      if (!active) return
      field?.value[itemName] ? setInputNameValue(field.value[itemName]) : setInputNameValue('')
      setActive(false)
      setModalIsActive(false)
      field && field.onBlur()
      onBlur && onBlur()
    }

    document.addEventListener('click', handleOutsideClick)

    return () => document.removeEventListener('click', handleOutsideClick)
  }, [active, field])

  const handleToggleModal = () => {
    if (isMobile) {
      if (modalIsActive) return

      return setModalIsActive(true)
    }

    setActive(!active)
    setFilterData(data)
    inputRef.current?.focus()
  }

  const getDefaultValue = !getDefaultValueFromCode
    ? (defaultValue && ((defaultValue as { [key: string]: string | number })[itemName] as string)) || ''
    : getDefaultValueFromCode[itemName]

  const handleInputChange = (value: string) => {
    setIsSearch(true)
    setActive(true)

    startTransition(() => setInputNameValue(value))

    if (value === '') {
      field?.onChange({})

      return startTransition(() => setFilterData(data))
    }

    if (!filterData) return

    const result = filterData.filter(
      (item) =>
        item[itemName]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item[itemValue]?.toString()?.toLowerCase()?.includes(value?.toLowerCase())
    )

    if (!isSearchInput) {
      if (result.length === 1 && result[0][itemValue] === String(value)) {
        field && field.onChange(result[0])
      } else {
        const timeOut = setTimeout(() => {
          field?.onChange({
            [itemName]: value,
            [itemValue]: value,
            [itemId]: value
          })

          clearTimeout(timeOut)
        }, 100)
      }
    }

    if (result && result.length) return startTransition(() => setFilterData(result))

    return startTransition(() => setFilterData(data))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      return
    }
  }

  useEffect(() => {
    if (!field?.value) {
      setInputNameValue('')
    }
  }, [field?.value])

  return (
    <>
      <div className={`relative group ${className} tn-select`} onClick={() => handleToggleModal()}>
        {/* render select input */}
        <label className={`${isRequired ? 'label-required' : ''} text-14 font-medium leading-[20px] text-black-3`}>
          {nameLabel}
        </label>
        <div className='relative mt-1.5'>
          <input
            className={`text-black-6 border-gray-11 h-11 w-full appearance-none rounded border border-gray-1 px-3 text-14 placeholder:text-14 placeholder:text-[#999999] placeholder:leading-[20px] placeholder:font-normal focus:border-primary focus:outline-none focus:ring-0 ${
              (fieldState?.error?.message || errorMessage) && 'border-red-1'
            }`}
            autoComplete='none'
            placeholder={placeholder}
            required={isRequired}
            maxLength={maxLength}
            value={inputNameValue ? inputNameValue : !isSearch ? getDefaultValue : ''}
            onChange={(event) => handleInputChange(event?.target?.value)}
            onKeyDown={(event) => handleKeyDown(event)}
            ref={inputRef}
            {...res}
            readOnly={!!isMobile}
          />
          <div
            className={`absolute transition-all duration-200 top-1/2 -translate-y-1/2 right-2.5 ${!active ? '' : 'rotate-180'}`}
          >
            <ArrowDownIcon />
          </div>

          {/* render list item option desktop */}
          {active && !isMobile && (
            <div
              className={`absolute top-15 w-full ${heightListOption} bg-white z-20 shadow-5 rounded overflow-y-auto scrollbar-input p-3 min-w-max`}
            >
              {_map(filterData, (item: SelectItemDropdown | Record<string, string>, index) => (
                <div
                  onClick={() => handleItemClick(item)}
                  key={(itemId && item[itemId]) || index}
                  className={`flex items-center gap-2 py-1.5 px-3 cursor-pointer rounded-[2px] transition-all duration-200 hover:bg-teal-8 ${item[itemName] === inputNameValue ? 'bg-teal-8' : 'bg-white'}`}
                >
                  {itemIcon && item[itemIcon] && (
                    <Image
                      src={`${item[itemIcon] || '/'}`}
                      width={29}
                      height={20}
                      alt={(item[itemName] as string) || ''}
                      title={(item[itemName] as string) || ''}
                      sizes='(max-width: 768px) 100vw, 100vw'
                      style={{ objectFit: 'contain', width: '24px', height: '16px' }}
                      loading='lazy'
                    />
                  )}
                  <p
                    className={`text-16 leading-1-5 transition-all duration-200 hover:font-medium hover:text-primary flex-1 ${item[itemName] === inputNameValue ? 'text-primary font-medium' : 'text-black-6 font-normal'}`}
                    id='select-item'
                    dangerouslySetInnerHTML={{ __html: item[itemName] || '' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* show error message */}
        {(fieldState?.error?.message || errorMessage) && (
          <div className='text-12 font-normal leading-[18px] text-red-1 mt-1'>
            {fieldState?.error?.message ?? errorMessage}
          </div>
        )}

        {isMobile && (
          <>
            {modalIsActive && (
              <>
                <div className='fixed inset-0 bg-[#262626] opacity-80 !z-50' onClick={handleCloseModal}></div>
              </>
            )}
            <div
              className={`fixed shadow-primary left-0 transition-all !z-50 duration-300 bg-white rounded-t-2xl w-[100vw] overflow-hidden ${
                modalIsActive ? 'bottom-0  !z-50' : '-bottom-[100vh] !z-50'
              }`}
            >
              <ModalSelectMobile
                handleCloseModal={handleCloseModal}
                handleCommonOptionClick={(item: SelectItemDropdown) => handleItemClick(item)}
                commonMobileData={filterData}
                fieldName={{
                  itemName,
                  itemId,
                  itemIcon
                }}
                inputNameValue={inputNameValue}
                isShowInputSearch={isShowInputSearch}
                modalIsActive={modalIsActive}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
