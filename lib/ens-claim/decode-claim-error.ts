/** Map on-chain ENS claim failures to user-facing copy. */
export function friendlyEnsClaimError(error: unknown): string {
  const parts: string[] = []
  let current: unknown = error

  for (let depth = 0; depth < 6 && current; depth++) {
    if (current instanceof Error) {
      if (current.message) parts.push(current.message)
      current = current.cause
    } else {
      parts.push(String(current))
      break
    }
  }

  const text = parts.join(' ')

  if (text.includes('0xb455aae8') || text.includes('Unauthorised')) {
    return 'Claim registrar is not approved on wld5050.eth yet. Platform setup is incomplete — contact support.'
  }
  if (text.includes('0x8baa579f') || text.includes('InvalidSignature')) {
    return 'Claim signature was rejected. Try again or contact support.'
  }
  if (text.includes('0x646cf558') || text.includes('AlreadyClaimed')) {
    return 'This raffle badge was already claimed on Ethereum.'
  }
  if (text.includes('0x0819bdcd') || text.includes('SignatureExpired')) {
    return 'Claim signature expired. Click the button again for a fresh signature.'
  }
  if (
    text.includes('User rejected') ||
    text.includes('user rejected') ||
    text.includes('User denied')
  ) {
    return 'Transaction cancelled in wallet.'
  }
  if (text.includes('insufficient funds')) {
    return 'Not enough ETH on Ethereum mainnet for gas.'
  }
  if (
    text.includes('switch chain') ||
    text.includes('SwitchChain') ||
    text.includes('Chain not configured')
  ) {
    return 'Switch your wallet to Ethereum mainnet, then try again.'
  }
  if (
    text.includes('Internal error') ||
    text.includes('cloudflare-eth.com') ||
    text.includes('Failed to fetch')
  ) {
    return 'Could not reach Ethereum RPC. Switch to mainnet in your wallet and try again.'
  }

  return 'Claim failed. Switch to Ethereum mainnet, ensure you have ETH for gas, then try again.'
}
