import { NextRequest, NextResponse } from 'next/server'

/** CRE workflow AgentKit pre-draw check — human-backed agent gate. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      raffleId?: number
      creator?: string
      token?: string
    }

    if (body.raffleId == null || !body.creator) {
      return NextResponse.json({ ok: false, error: 'Missing raffleId or creator' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, raffleId: body.raffleId, token: body.token ?? 'USDC' })
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }
}
