import throttle from 'lodash/throttle'
import { useCallback, useEffect, useRef, useState } from 'react'

const useDisplay = (param?: number) => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const innerWidth = useRef(typeof window !== 'undefined' ? window.innerWidth : 0)

  const handleResize = useCallback(
    throttle(() => {
      if (typeof window !== 'undefined') {
        innerWidth.current = window.innerWidth
        setIsMobile(innerWidth.current < (param ?? 1280))
      }
    }, 200),
    [param]
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize()

      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  return isMobile
}

export default useDisplay
