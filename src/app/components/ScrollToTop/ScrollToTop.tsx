'use client'

import useDisplay from '@/libs/hooks/useDisplay'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useDisplay(992)

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300)
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    isVisible && (
      <button
        className={`${isMobile ? 'bottom-1 left-1' : 'bottom-5 right-5'} fixed  cursor-pointer border-none bg-transparent`}
        onClick={scrollToTop}
      >
        <Image
          src='https://dusyzh85wmzqh.cloudfront.net/frontend/images/scroll-top.png'
          title='Scroll To Top'
          alt='Scroll To Top'
          width={80}
          height={81}
        />
      </button>
    )
  )
}
