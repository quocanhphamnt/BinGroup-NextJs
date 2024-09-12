import { useEffect, useState } from 'react'

export const useTabFocus = () => {
  const [isTabFocused, setIsTabFocused] = useState(true)

  useEffect(() => {
    const handleFocus = () => {
      setIsTabFocused(true)
    }

    const handleBlur = () => {
      setIsTabFocused(false)
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return isTabFocused
}
