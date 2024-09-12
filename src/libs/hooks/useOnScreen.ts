'use client'

import { useEffect, useRef, useState } from 'react'

interface UseOnScreenOptions extends IntersectionObserverInit {
  once?: boolean
  threshold?: number | number[]
}

const useOnScreen = (options: UseOnScreenOptions) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isIntersecting, setIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const isCurrentlyIntersecting = entry.isIntersecting
      setIntersecting(isCurrentlyIntersecting)

      if (isCurrentlyIntersecting && options.once) {
        setHasIntersected(true)
        observer.unobserve(entry.target)
      }
    }, options)

    if (ref.current && !(options.once && hasIntersected)) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options, hasIntersected])

  const isVisible = options.once ? hasIntersected || isIntersecting : isIntersecting

  return { ref, isVisible }
}

export default useOnScreen
