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

  return (
    <nav className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-200">
      <div className="flex items-center gap-6 min-w-0">
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

        <div className="hidden xl:flex items-center gap-5">
          {navLinks.map(({ label, href }) => (
            <NavLink key={href} href={href} label={label} pathname={pathname} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="xl:hidden inline-flex items-center justify-center w-9 h-9 border border-gray-200 rounded-md hover:border-black transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="font-display text-left">Menu</DrawerTitle>
            </DrawerHeader>
            <nav className="flex flex-col gap-1 px-4 pb-6">
              {navLinks.map(({ label, href }) => (
                <DrawerClose key={href} asChild>
                  <Link
                    href={href}
                    className={cn(
                      'px-3 py-3 text-[17.5px] font-medium rounded-md transition-colors',
                      isNavActive(href, pathname)
                        ? 'bg-gray-50 text-black'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50',
                    )}
                  >
                    {label}
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </DrawerContent>
        </Drawer>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          World ID
        </span>
        <Link href="/create">
          <button className="text-[13px] font-medium px-4 py-2 bg-black text-white rounded-md hover:opacity-80 transition-opacity whitespace-nowrap">
            + Create raffle
          </button>
        </Link>
      </div>
    </nav>
  )
}
