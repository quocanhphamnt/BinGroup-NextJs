'use client'

import { useEffect, useState } from 'react'

const useMouseMovedOnLoad = () => {
  const [hasMoved, setHasMoved] = useState(false)

  useEffect(() => {
    // Define the mouse move event handler
    const handleMouseMove = () => {
      setHasMoved(true)
      // Remove the event listener after the mouse has moved
      window.removeEventListener('mousemove', handleMouseMove)
    }

    // Attach the mouse move event listener
    window.addEventListener('mousemove', handleMouseMove)

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, []) // Empty dependency array ensures this effect runs only once on mount

  return hasMoved
}

export default useMouseMovedOnLoad
