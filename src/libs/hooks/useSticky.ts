import { useEffect, useState } from 'react'
import useDisplay from './useDisplay'

export function useSticky(ref: React.RefObject<HTMLElement>) {
  const [isSticky, setIsSticky] = useState<boolean>(false)
  const isMobile = useDisplay(1024)
  const offset = isMobile ? 66 : 92

  const handleScroll = () => {
    if (ref.current) {
      const elementTop = ref.current.offsetTop - offset
      setIsSticky(window.scrollY >= elementTop)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ref, isMobile])

  return isSticky
}
