import { NextRequest, NextResponse } from 'next/server'
import { getAddress, isAddress } from 'viem'
import { signEnsClaim } from '@/lib/ens-claim/sign-claim'
import { isEnsClaimedOnRegistrar, verifyRaffleWinner } from '@/lib/ens-claim/verify-winner'
import { resolveEnsToAddress } from '@/lib/ens/resolve'
import { ensSubnameLabel } from '@/lib/ens-claim/constants'

export async function POST(req: NextRequest) {
  let body: { raffleId?: number; winner?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const raffleId = Number(body.raffleId)
  const winnerRaw = body.winner?.trim()

  if (!Number.isInteger(raffleId) || raffleId < 1) {
    return NextResponse.json({ error: 'Invalid raffleId' }, { status: 400 })
  }
  if (!winnerRaw || !isAddress(winnerRaw)) {
    return NextResponse.json({ error: 'Invalid winner address' }, { status: 400 })
  }

  const winner = getAddress(winnerRaw)

  const verification = await verifyRaffleWinner(raffleId, winner)
  if (!verification) {
    return NextResponse.json(
      { error: 'Not the verified winner for this settled raffle' },
      { status: 403 },
    )
  }

  const alreadyClaimedOnRegistrar = await isEnsClaimedOnRegistrar(raffleId)
  if (alreadyClaimedOnRegistrar) {
    return NextResponse.json({ error: 'Badge already claimed on L1' }, { status: 409 })
  }

  const label = ensSubnameLabel(verification.winnerSubname)
  const resolved = label ? await resolveEnsToAddress(`${label}.wld5050.eth`) : null
  if (resolved && getAddress(resolved) === winner) {
    return NextResponse.json({ error: 'ENS name already resolves to winner' }, { status: 409 })
  }

  const payload = await signEnsClaim({
    raffleId,
    winner,
    winnerSubname: verification.winnerSubname,
  })

  if (!payload) {
    return NextResponse.json(
      { error: 'ENS claim signing is not configured on this server' },
      { status: 503 },
    )
  }

  return NextResponse.json(payload)
}
