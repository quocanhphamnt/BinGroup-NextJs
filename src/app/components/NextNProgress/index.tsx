'use client'

import { usePathname, useRouter } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import * as NProgress from 'nprogress'
import { useEffect } from 'react'

const NextTopLoaderClient = () => {
  const router = useRouter()
  const pathName = usePathname()

  useEffect(() => {
    // eslint-disable-next-line import/namespace
    NProgress.done()
  }, [pathName, router])

  return (
    <NextTopLoader
      color='#008291'
      initialPosition={0.08}
      crawlSpeed={200}
      height={4}
      crawl={true}
      showSpinner={false}
      easing='ease'
      speed={200}
    />
  )
}

export default NextTopLoaderClient
