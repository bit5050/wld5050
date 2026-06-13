import { NextRequest, NextResponse } from 'next/server'
import { resolveENS } from '@/lib/ens-server'

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address') as `0x${string}` | null
  if (!address) return NextResponse.json({ name: null })
  const name = await resolveENS(address)
  return NextResponse.json({ name })
}
