'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y, EffectFade } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'
import { cn } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

export type MediaCarouselItem = {
  id: string
  content: React.ReactNode
}

type Props = {
  items: MediaCarouselItem[]
  className?: string
  effect?: 'slide' | 'fade'
  loop?: boolean
  options?: SwiperOptions
}

/** Minimal carousel — raffles, settlements, gallery strips. */
export function MediaCarousel({
  items,
  className,
  effect = 'slide',
  loop = true,
  options,
}: Props) {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y, EffectFade]}
      effect={effect}
      fadeEffect={{ crossFade: true }}
      loop={loop && items.length > 1}
      navigation
      pagination={{ clickable: true }}
      className={cn('w-full rounded-lg border border-border', className)}
      {...options}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>{item.content}</SwiperSlide>
      ))}
    </Swiper>
  )
}

export { Swiper, SwiperSlide }
