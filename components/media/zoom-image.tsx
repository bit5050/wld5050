'use client'

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  className?: string
  zoomMargin?: number
}

/** Medium-style click-to-zoom image. */
export function ZoomImage({ src, alt, className, zoomMargin = 24 }: Props) {
  return (
    <Zoom zoomMargin={zoomMargin}>
      <img
        src={src}
        alt={alt}
        className={cn('cursor-zoom-in rounded-lg border border-border object-cover', className)}
      />
    </Zoom>
  )
}

export { Zoom as ZoomImageRoot }
