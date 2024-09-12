/* eslint-disable @typescript-eslint/no-explicit-any */

import useDisplay from '@/libs/hooks/useDisplay'
import { useSearch } from '@/libs/utils/utilFuncs'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface IAppProps {
  handleCloseModal: () => void
  handleCommonOptionClick?: (item: SelectItemDropdown) => void
  commonMobileData?: SelectItemDropdown[]
  fieldName?: FieldNameSelect
  inputNameValue?: string
  isShowInputSearch?: boolean
  modalIsActive?: boolean
}

export default function ModalSelectMobile(props: IAppProps) {
  const [filterData, setOriginData] = useState(props.commonMobileData)
  const isMobile = useDisplay()
  const [searchFilter, setSearchFilter] = useState('')
  const searchData = useSearch(searchFilter, filterData, props.fieldName)

  useEffect(() => {
    setOriginData(props.commonMobileData)
  }, [props.commonMobileData])

  const handleCloseModal = () => {
    setSearchFilter('')
    setOriginData(props.commonMobileData)
    props.handleCloseModal()
  }

  return (
    <div className='pb-4'>
      <div className='sticky top-0 px-4 pt-4 bg-white'>
        <div className='w-10 h-1 bg-[#c4c4c4] mx-auto rounded-2xl cursor-pointer ' onClick={handleCloseModal}></div>
        {isMobile && props.commonMobileData && props.isShowInputSearch && (
          <div className='relative mt-3'>
            <input
              name='search'
              className='text-black-6 border-gray-11 h-11 w-full appearance-none rounded border border-gray-6 pl-10 text-14 placeholder:text-14 placeholder:text-[#999999] placeholder:leading-[20px] placeholder:font-normal focus:border-primary focus:outline-none focus:ring-0'
              placeholder='Search'
              onChange={(e) => {
                setSearchFilter(e?.target?.value)
              }}
              value={searchFilter}
            />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='26'
              height='26'
              viewBox='0 0 26 26'
              fill='none'
              className='absolute left-2 top-1/2 -translate-y-1/2'
            >
              <path
                d='M23.5159 21.9842L17.6703 16.1385C18.8132 14.6706 19.5 12.8332 19.5 10.8334C19.5 6.05483 15.6119 2.16675 10.8334 2.16675C6.05477 2.16675 2.16669 6.05483 2.16669 10.8334C2.16669 15.612 6.05477 19.5001 10.8334 19.5001C12.8332 19.5001 14.6705 18.8132 16.1384 17.6714L21.9841 23.5171C22.1954 23.7272 22.4727 23.8334 22.75 23.8334C23.0274 23.8334 23.3047 23.7272 23.5159 23.516C23.9395 23.0924 23.9395 22.4077 23.5159 21.9842ZM4.33335 10.8334C4.33335 7.24866 7.2486 4.33341 10.8334 4.33341C14.4181 4.33341 17.3334 7.24866 17.3334 10.8334C17.3334 14.4182 14.4181 17.3334 10.8334 17.3334C7.2486 17.3334 4.33335 14.4182 4.33335 10.8334Z'
                fill='#666666'
              />
            </svg>
          </div>
        )}
      </div>
      <ul className={`pl-4 pr-2 h-full max-h-[360px] ${searchData?.length > 10 && 'overflow-y-scroll'}`}>
        {isMobile &&
          props.modalIsActive &&
          searchData?.map((item: any, index: number) => {
            const { itemName, itemIcon, itemId } = props.fieldName || {
              itemIcon: 'icon',
              itemName: 'name',
              itemId: 'id'
            }

            return (
              <li
                className={`flex items-center gap-2.5 pl-3 py-1.5 hover:bg-teal-8 transition-all duration-200 rounded-[2px] cursor-pointer ${item[itemName] === props.inputNameValue ? 'bg-teal-8' : 'bg-white'}`}
                key={item[itemId] || index}
                onClick={() => props.handleCommonOptionClick && props.handleCommonOptionClick(item)}
              >
                <p
                  className={`flex items-center flex-1
                text-16 font-normal leading-1-4 text-neutral-8 cursor-pointer ${item[itemName] === props.inputNameValue ? 'text-primary font-medium' : 'text-black-6 font-normal'}`}
                  onClick={() => props.handleCommonOptionClick && props.handleCommonOptionClick(item)}
                >
                  {item[itemIcon] && (
                    <Image
                      src={(item[itemIcon] as string) ?? ((item[itemIcon] as string) || '/')}
                      width={29}
                      height={20}
                      alt='Flag'
                      title='Flag'
                      className='inline-block mr-2 w-6 h-4'
                    />
                  )}

                  {item[itemName]}
                </p>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
