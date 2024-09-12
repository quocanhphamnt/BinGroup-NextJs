import { useEffect, useState } from 'react'

const CounterAnimation = ({
  initialValue = 0,
  duration = 2000,
  countTo,
  isVisible
}: {
  initialValue?: number
  duration?: number
  countTo: number
  isVisible: boolean
}) => {
  const [count, setCount] = useState(initialValue)

  useEffect(() => {
    let startTimestamp: number

    if (isVisible) {
      const animate = (timestamp: number): void => {
        if (!startTimestamp) startTimestamp = timestamp
        const elapsed = timestamp - startTimestamp

        if (elapsed < duration) {
          const progress = elapsed / duration
          const nextCount = Math.floor(initialValue + (countTo - initialValue) * progress)
          setCount(nextCount)
          requestAnimationFrame(animate)
        } else {
          setCount(countTo)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [initialValue, duration, countTo, isVisible])

  return count?.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
}

export default CounterAnimation
