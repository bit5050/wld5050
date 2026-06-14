'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { isNavActive, navLinks } from '@/lib/nav-links'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import { cn } from '@/lib/utils'

function NavLink({
  href,
  label,
  pathname,
  onClick,
  className,
}: {
  href: string
  label: string
  pathname: string
  onClick?: () => void
  className?: string
}) {
  const active = isNavActive(href, pathname)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'text-[15px] font-medium transition-colors whitespace-nowrap',
        active ? 'text-black' : 'text-gray-500 hover:text-black',
        className,
      )}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const mobileMenu = (
    <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-black"
        >
          <Menu className="h-5 w-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-left font-display">Menu</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6">
          {navLinks.map(({ label, href }) => (
            <DrawerClose key={href} asChild>
              <Link
                href={href}
                className={cn(
                  'rounded-md px-3 py-3 text-[17.5px] font-medium transition-colors',
                  isNavActive(href, pathname)
                    ? 'bg-gray-50 text-black'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black',
                )}
              >
                {label}
              </Link>
            </DrawerClose>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  )

  return (
    <nav className="border-b border-gray-200">
      {/* Mobile — logo, wallet, menu stacked and centered */}
      <div className="flex flex-col items-center gap-3 px-6 py-4 xl:hidden">
        <Link href="/" className="inline-flex shrink-0 items-center justify-center">
          <Image
            src="/images/WLD5050.jpg"
            alt="WLD5050"
            width={1990}
            height={392}
            className="h-[2.4rem] w-auto"
            priority
            unoptimized
          />
        </Link>
        <ConnectWalletButton />
        {mobileMenu}
      </div>

      {/* Desktop — horizontal bar */}
      <div className="hidden items-center justify-between gap-4 px-6 py-5 xl:flex">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="inline-flex shrink-0 items-center">
            <Image
              src="/images/WLD5050.jpg"
              alt="WLD5050"
              width={1990}
              height={392}
              className="h-8 w-auto"
              priority
              unoptimized
            />
          </Link>

          <div className="flex items-center gap-5">
            {navLinks.map(({ label, href }) => (
              <NavLink key={href} href={href} label={label} pathname={pathname} />
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            World ID
          </span>
          <ConnectWalletButton />
        </div>
      </div>
    </nav>
  )
}
