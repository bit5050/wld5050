'use client'

import Balancer from 'react-wrap-balancer'

type Props = {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
}

export default function BalancedText({ children, as: Tag = 'span', className }: Props) {
  return (
    <Tag className={className}>
      <Balancer>{children}</Balancer>
    </Tag>
  )
}
