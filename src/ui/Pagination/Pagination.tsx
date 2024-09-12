'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import ArrowLeftIcon from '../icon/ArrowLeftIcon'
import ArrowRightIcon from '../icon/ArrowRightIcon'
import styles from './pagination.module.css'

interface Props {
  pageCount: number
  onChange?: (page: number) => void
}

export default function PaginationNews({ pageCount, onChange }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState<number>(
    searchParams?.get('page') ? Number(searchParams?.get('page')) : 1
  )
  const keySearch = searchParams?.get('search') || ''

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = searchParams ? new URLSearchParams(searchParams) : new URLSearchParams()

      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handlePageChange = (event: { selected: number }) => {
    const selectedPage = (event.selected + 1).toString()

    onChange && onChange(+selectedPage)

    if (Number(selectedPage) === 1 && pathname)
      return router.push(`${pathname}?${keySearch ? 'search=' + keySearch : ''}`)

    return router.push(pathname + '?' + createQueryString('page', selectedPage))
  }

  useEffect(() => {
    const currentPageInSearchParams = searchParams?.get('page') ? Number(searchParams.get('page')) : 1
    setCurrentPage(currentPageInSearchParams)

    if (currentPageInSearchParams === 1 && pathname)
      return router.push(`${pathname}?${keySearch ? 'search=' + keySearch : ''}`)

    if (currentPageInSearchParams > pageCount)
      return router.push(pathname + '?' + createQueryString('page', pageCount.toString()))
  }, [searchParams, pageCount, createQueryString, pathname, router])

  return (
    <>
      <ReactPaginate
        containerClassName={styles['wrapper']}
        pageClassName={styles['item']}
        activeClassName={styles['active']}
        disabledClassName={styles['disabled']}
        previousClassName={styles['previous']}
        nextClassName={styles['next']}
        breakClassName={styles['break']}
        onPageChange={handlePageChange}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        forcePage={currentPage - 1}
        breakLabel='...'
        previousLabel={<ArrowLeftIcon />}
        nextLabel={<ArrowRightIcon />}
      />
    </>
  )
}
