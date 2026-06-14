import Image from 'next/image'
import type { PaymentToken } from '@/lib/contracts/wld5050'

const LOGOS: Record<PaymentToken, { src: string; alt: string }> = {
  USDC: { src: '/icons/usdc.png', alt: 'USD Coin (USDC)' },
  WLD: { src: '/icons/wld.jpg', alt: 'Worldcoin (WLD)' },
}

type Props = {
  token: PaymentToken
  size?: number
  className?: string
}

export default function TokenLogo({ token, size = 28, className = '' }: Props) {
  const { src, alt } = LOGOS[token]
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover ${className}`.trim()}
    />
  )
}
