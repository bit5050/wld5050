'use client'
import { useEffect, useState } from 'react'

interface Props {
  address: string
  fallback?: string
  className?: string
}

export default function ENSName({ address, fallback, className = '' }: Props) {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return
    fetch(`/api/ens?address=${address}`)
      .then(r => r.json())
      .then(d => setName(d.name))
      .catch(() => null)
  }, [address])

  const display = name ?? fallback ?? `${address.slice(0,6)}...${address.slice(-4)}`

  return (
    <span className={`font-mono ${className}`}>{display}</span>
  )
}
