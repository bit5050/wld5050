import Link from 'next/link'
import {
  WLD5050_CONTRACT_ADDRESS,
  getWld5050WorldscanUrl,
} from '@/lib/contracts/contract-address'

type Props = {
  className?: string
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function ContractAddressLink({ className = '' }: Props) {
  return (
    <Link
      href={getWld5050WorldscanUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center gap-1 font-mono text-[11px] text-[#616161] transition-colors hover:text-black',
        className,
      ].join(' ')}
      title={WLD5050_CONTRACT_ADDRESS}
    >
      Contract {truncateAddress(WLD5050_CONTRACT_ADDRESS)}
      <span aria-hidden>↗</span>
    </Link>
  )
}
