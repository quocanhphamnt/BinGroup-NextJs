import useDisplay from '@/libs/hooks/useDisplay'
import { useEffect, useState } from 'react'

export function useScrollSticky() {
  const [isSticky, setIsSticky] = useState<boolean>(false)
  const isMobile = useDisplay(768)

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    setIsSticky(Number(currentScrollY) >= (isMobile ? 455 : 755))
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  return { isSticky, isMobile }
}
