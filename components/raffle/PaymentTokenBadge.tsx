import TokenLogo from '@/components/raffle/TokenLogo'
import type { PaymentToken } from '@/lib/contracts/wld5050'

type Props = {
  token: PaymentToken
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}

export default function PaymentTokenBadge({
  token,
  size = 'sm',
  showLabel = true,
  className = '',
}: Props) {
  const logoSize = size === 'sm' ? 18 : 22
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-[11px]'

  return (
    <span
      className={[
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-[#FAFAFA] px-2 py-0.5 font-mono tracking-wide text-black',
        textSize,
        className,
      ].join(' ')}
      title={`${token} raffle — tickets sold in ${token}`}
    >
      <TokenLogo token={token} size={logoSize} />
      {showLabel ? <span>{token}</span> : null}
    </span>
  )
}
