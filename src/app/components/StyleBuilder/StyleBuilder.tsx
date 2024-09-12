'use client'

import { useEffect } from 'react'

export default function StyleBuilder({ style, implementStyle }: { style: string; implementStyle?: string }) {
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.type = 'text/css'
    styleElement.innerHTML = style
    document.head.prepend(styleElement)
  }, [style])

  return (
    <style jsx global>{`
      ${implementStyle}
    `}</style>
  )
}
