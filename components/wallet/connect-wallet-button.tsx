'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { isValidPrivyAppId, publicEnv } from '@/lib/env.public'
import { cn } from '@/lib/utils'

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function DisabledConnectButton() {
  return (
    <button
      type="button"
      disabled
      className="text-[13px] font-medium px-4 py-2 bg-black text-white rounded-md opacity-40 cursor-not-allowed whitespace-nowrap"
    >
      Connect Wallet
    </button>
  )
}

function ConnectWalletButtonInner() {
  const { ready, authenticated, login, logout } = usePrivy()
  const { wallets } = useWallets()

  const address = wallets[0]?.address

  if (!ready) {
    return (
      <button
        type="button"
        disabled
        className="text-[13px] font-medium px-4 py-2 bg-black text-white rounded-md opacity-60 cursor-wait whitespace-nowrap"
      >
        Connect Wallet
      </button>
    )
  }

  if (authenticated && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'inline-flex items-center rounded-md border border-gray-200 px-3 py-2',
            'font-mono text-[12px] font-medium text-black transition-colors hover:border-black',
          )}
        >
          {truncateAddress(address)}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          <DropdownMenuItem
            onClick={() => logout()}
            className="cursor-pointer text-[13px]"
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <button
      type="button"
      onClick={() => login()}
      className="text-[13px] font-medium px-4 py-2 bg-black text-white rounded-md hover:opacity-80 transition-opacity whitespace-nowrap"
    >
      Connect Wallet
    </button>
  )
}

export default function ConnectWalletButton() {
  if (!isValidPrivyAppId(publicEnv.privyAppId)) {
    return <DisabledConnectButton />
  }

  return <ConnectWalletButtonInner />
}
