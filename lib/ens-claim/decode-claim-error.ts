/** Map on-chain ENS claim failures to user-facing copy. */
export function friendlyEnsClaimError(error: unknown): string {
  const text =
    error instanceof Error
      ? `${error.message} ${error.cause instanceof Error ? error.cause.message : ''}`
      : String(error)

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
  if (text.includes('User rejected') || text.includes('user rejected')) {
    return 'Transaction cancelled in wallet.'
  }
  if (text.includes('insufficient funds')) {
    return 'Not enough ETH on Ethereum mainnet for gas.'
  }

  return 'Claim failed. Ensure you are on Ethereum mainnet with ETH for gas, then try again.'
}
