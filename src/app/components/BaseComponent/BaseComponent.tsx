'use client'

import { NEXT_PUBLIC_GOOGLE_GTM } from '@/constants/env'
import { KEY_ADS_MAPPING_SEARCH_PARAMS } from '@/constants/generate'
import { setCookie } from 'cookies-next'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { Suspense, useEffect } from 'react'

function Search() {
  const searchParams = useSearchParams()

  // Get data ads from search param and set in cookie
  useEffect(() => {
    if (searchParams) {
      for (const key in KEY_ADS_MAPPING_SEARCH_PARAMS) {
        const searchKeyParam = KEY_ADS_MAPPING_SEARCH_PARAMS[key as keyof typeof KEY_ADS_MAPPING_SEARCH_PARAMS]

        const valueSearchParam = searchParams && searchParams.get(searchKeyParam)

        if (valueSearchParam) {
          setCookie(`__data_ads_${key}`, valueSearchParam, { maxAge: 2592000 })
        }
      }
    }
  }, [searchParams])

  return <></>
}

/**
 * BaseComponent
 *
 * @param {string} langCode - The language to update in the global store
 * @param {string} locationCode - The location to update in the global store
 */
export const BaseComponent = () => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const listClass =''

  return (
    <>
      <Suspense>
        <Search />
      </Suspense>

      <Script
        id='google-tag-manager'
        dangerouslySetInnerHTML={{
          __html: `<!-- Google Tag Manager -->
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${NEXT_PUBLIC_GOOGLE_GTM}');
          <!-- End Google Tag Manager -->`
        }}
      />
    </>
  )
}
