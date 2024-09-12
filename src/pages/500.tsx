import { useLayoutEffect } from 'react'

export default function Custom500() {
  useLayoutEffect(() => {
    window.location.href = '/notfound.html'
  })
}
