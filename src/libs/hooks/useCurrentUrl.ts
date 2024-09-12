'use client'

import type { IAppContext } from '@/app/components/Provider/AppProvider'
import { AppContext } from '@/app/components/Provider/AppProvider'
import { usePathname } from 'next/navigation'
import type { Context } from 'react'
import { useContext, useEffect, useState } from 'react'

// Custom hook to calculate the current URL based on language, location, and pathName.
const useCurrentUrl = () => {
  // Get the current pathName using the usePathname hook from next/navigation.
  const pathName = usePathname()

  // Retrieve language and location from the AppContext using useContext.
  const { langLocationSlashed } = useContext(AppContext as unknown as Context<IAppContext>)

  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.pathname.replace(langLocationSlashed, '')}${window.location.search}`.replace(
        /^\/|\/$/g,
        ''
      )

      setCurrentUrl(url)
    }
  }, [pathName])

  return currentUrl
}

export default useCurrentUrl
