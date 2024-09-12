/* eslint-disable @typescript-eslint/no-explicit-any */

import '@/app/globals.css'
import { NEXT_PUBLIC_DEFAULT_LANG, NEXT_PUBLIC_DEFAULT_LOCATION } from '@/constants/env'
import { CRAWL, MOBILE } from '@/constants/generate'
import commonServerApi from '@/libs/api/server/commonServer.api'
import { useLangUrlSlashed } from '@/libs/utils/utilFuncs'
import { useQueryParams, useSearchQuery } from '@/middleware'
import type { Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { type ReactNode } from 'react'
import { BaseComponent } from '../components/BaseComponent'
import FooterComponent from '../components/Footer'
import HeaderComponent from '../components/Header'
import NextTopLoaderClient from '../components/NextNProgress'
import { AppProvider, TankTackProvider } from '../components/Provider'
import ScrollToTop from '../components/ScrollToTop'

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap'
})

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width'
}

const commonConfig = [''] as const

export type ExtractedConfigGlobalDataType = Record<(typeof commonConfig)[number], string>

/**
 * RootLayout
 *
 * @param {ReactNode} children - The main content of the layout
 * @param {Object} params - Parameters including locale for the layout
 * @param {string} params.locale - The locale used for language and location
 */
export default async function RootLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  // Destructure the locale to get lang and location
  const [lang, location, device, crawl, ...rest] = useQueryParams(params.locale)

  const searchQuery = useSearchQuery(rest)

  const isMobile = device === MOBILE
  const isCrawl = crawl === CRAWL
  const langLocationSlashed = `${useLangUrlSlashed(lang, location)}`

  const getInfoPageLang =
    lang === NEXT_PUBLIC_DEFAULT_LANG && location === NEXT_PUBLIC_DEFAULT_LOCATION
      ? NEXT_PUBLIC_DEFAULT_LANG
      : (langLocationSlashed.replace('/', '') as string)

  const [t] = await Promise.all([
    commonServerApi.extractConfigData<ExtractedConfigGlobalDataType>(commonConfig, lang, location)
  ])

  return (
    <html lang={getInfoPageLang} className={roboto.className}>
      <body className='overflow-x-hidden'>
        {!isCrawl && <NextTopLoaderClient />}

        {!isCrawl && <BaseComponent />}

        <AppProvider
          lang={lang}
          location={location}
          device={device}
          isCrawl={isCrawl}
          isMobile={isMobile}
          langLocationSlashed={langLocationSlashed}
          currentUrl=''
          configGlobal={t}
          pageKeyword={searchQuery?.pageKeyword}
        >
          <TankTackProvider>
            <HeaderComponent />

            {children}

            {!isCrawl && <FooterComponent />}

            {!isCrawl && <ScrollToTop />}
          </TankTackProvider>
        </AppProvider>
      </body>
    </html>
  )
}
