import { NextRequest, NextResponse } from 'next/server'
import { signRequest } from '@worldcoin/idkit-server'
import { serverEnv } from '@/lib/env.server'

export async function GET(req: NextRequest) {
  const signingKey = serverEnv.worldRpSigningKey()
  const rpId = serverEnv.worldRpId()

  if (!signingKey || !rpId) {
    return NextResponse.json(
      { error: 'World ID relying party is not configured on the server.' },
      { status: 503 },
    )
  }

  const action = req.nextUrl.searchParams.get('action') ?? undefined

  try {
    const signed = signRequest({
      signingKeyHex: signingKey,
      action,
      ttl: 300,
    })

    return NextResponse.json({
      rp_id: rpId,
      nonce: signed.nonce,
      created_at: signed.createdAt,
      expires_at: signed.expiresAt,
      signature: signed.sig,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign RP context'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
