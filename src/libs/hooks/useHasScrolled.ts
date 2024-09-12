import { useEffect, useState } from 'react'

const useMouseMove = (): boolean => {
  const [hasMoved, setHasMoved] = useState<boolean>(false)

  useEffect(() => {
    const handleMouseMove = (): void => {
      setHasMoved(true)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return hasMoved
}

export default useMouseMove
