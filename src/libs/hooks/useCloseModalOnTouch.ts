// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RefObject, useEffect } from 'react'

const useCloseModalOnTouch = (modalRef: RefObject<HTMLElement>, closeModal: () => void) => {
  let startY = 0

  const handleTouchStart = (event: TouchEvent) => {
    startY = event.touches[0].clientY
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (modalRef.current) {
      const currentY = event.touches[0].clientY
      const diffY = currentY - startY

      if (diffY > 50) {
        closeModal()
      }
    }
  }

  useEffect(() => {
    const modalElement = modalRef.current

    if (modalElement) {
      modalElement.addEventListener('touchstart', handleTouchStart)
      modalElement.addEventListener('touchmove', handleTouchMove)

      return () => {
        modalElement.removeEventListener('touchstart', handleTouchStart)
        modalElement.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [modalRef, closeModal])
}

export default useCloseModalOnTouch
