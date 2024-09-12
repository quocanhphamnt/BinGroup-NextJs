import { useCallback, useEffect, useState } from 'react'

const useDisableMouseAndTouch = () => {
  const [isDisabled, setIsDisabled] = useState(false)

  const disableEvents = useCallback(
    (event: { preventDefault: () => void; stopPropagation: () => void }) => {
      if (isDisabled) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    [isDisabled]
  )

  useEffect(() => {
    const eventTypes = ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend', 'touchmove']

    // Add or remove event listeners
    eventTypes.forEach((type) => {
      document[isDisabled ? 'addEventListener' : 'removeEventListener'](type, disableEvents, true)
    })

    // Cleanup function to reset cursor and remove event listeners
    return () => {
      document.body.style.cursor = ''
      eventTypes.forEach((type) => {
        document.removeEventListener(type, disableEvents, true)
      })
    }
  }, [isDisabled, disableEvents])

  return [isDisabled, setIsDisabled]
}

export default useDisableMouseAndTouch
