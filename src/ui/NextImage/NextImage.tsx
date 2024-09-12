'use client'

import Image from 'next/image'
import styles from './NextImages.module.css'

interface NextImageProps {
  src: string
  alt: string
  width: number
  height: number
  title?: string
  className?: string
  quality?: number
}

export default function NextImage({
  src,
  alt,
  width,
  height,
  title,
  className = '',
  quality = 75,
  ...res
}: NextImageProps) {
  return (
    <div className={`image-container ${className}`}>
      <Image
        src={src || '/'}
        alt={alt || ''}
        title={title}
        width={width}
        height={height}
        quality={quality}
        className={`${styles.img} transition-transform duration-300 hover:scale-110`}
        {...res}
      />
    </div>
  )
}
