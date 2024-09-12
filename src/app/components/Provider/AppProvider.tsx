'use client'

import type { ExtractedConfigGlobalDataType } from '@/app/[locale]/layout'
import { NEXT_PUBLIC_SITE } from '@/constants/env'
import { COOKIES_KEY } from '@/constants/generate'
import type { CountryData, Language } from '@/types/common'
import { getCookie } from 'cookies-next'
import type { PropsWithChildren } from 'react'
import { createContext, useState } from 'react'

const initialState = {
  lang: '', // The current language of the website
  device: '', // The device type
  isCrawl: false,
  isMobile: false,
  location: '', // The current location of the website
  locationHotLine: '',
  currentUrl: '', // The current URL of the website (excluding language and location)
  activeLocation: undefined,
  activeLanguage: undefined,
  updateContextValue: () => {},
  langLocationSlashed: '', // The language and location combined with a slash (e.g. en-gx, vi-vn)
  configGlobal: null, // The global configuration of the website (e.g. txt_search, btn_set_up_now, etc.)
  menuHeader: [],
  menuFooter: [],
  currentLocation: null
}

export const AppContext = createContext<IAppContext>(initialState)

export interface IAppContext {
  lang: string
  device: string
  isCrawl: boolean
  isMobile: boolean
  location: string
  locationHotLine?: string
  currentUrl?: string
  activeLocation?: CountryData | undefined
  activeLanguage?: Language | undefined
  activeLanguages?: Language[] | undefined
  updateContextValue?: (newState: Partial<IAppContext>) => void
  langLocationSlashed?: string
  userIp?: string
  site?: string
  configGlobal?: ExtractedConfigGlobalDataType | null
  currentLocation?: Location | null
  pageKeyword?: string
}

function AppProvider({ children, ...initialState }: PropsWithChildren & IAppContext) {
  const [state, setState] = useState(initialState)

  // Update context value function
  const updateContextValue = (newState: Partial<IAppContext>) => {
    setState((prevState) => ({
      ...prevState,
      ...newState
    }))
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        updateContextValue,
        userIp: getCookie(COOKIES_KEY.IP) || '',
        site: NEXT_PUBLIC_SITE
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
