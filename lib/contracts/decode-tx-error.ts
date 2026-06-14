const REVERT_MESSAGES: Record<string, string> = {
  '0xddae3b71':
    'World ID proof root is not on-chain yet (or expired). Verify again and submit immediately.',
  '0x3ae7359e': 'World ID proof root has expired. Verify again right before submitting.',
  '0x09bde339': 'Invalid World ID proof. Verify again with the same wallet you use to sign.',
  '0xfb8f41b2': 'Insufficient USDC allowance. Approve USDC and try again.',
  '0xe450d38c': 'Insufficient USDC balance on World Chain.',
  '0x5274afe7': 'USDC transfer failed. Check your balance on World Chain (chain 480).',
}

export function friendlyTxError(error: unknown): string {
  if (!(error instanceof Error)) return 'Transaction failed.'

  const haystack = [
    error.message,
    error.cause instanceof Error ? error.cause.message : '',
    typeof error === 'object' && error !== null && 'shortMessage' in error
      ? String((error as { shortMessage?: string }).shortMessage ?? '')
      : '',
  ].join(' ')

  for (const [selector, message] of Object.entries(REVERT_MESSAGES)) {
    if (haystack.includes(selector)) return message
  }

  if (haystack.includes('NonExistentRoot')) {
    return REVERT_MESSAGES['0xddae3b71']
  }
  if (haystack.includes('ExpiredRoot')) {
    return REVERT_MESSAGES['0x3ae7359e']
  }
  if (haystack.includes('transfer amount exceeds balance') || haystack.includes('InsufficientBalance')) {
    return 'Insufficient balance on World Chain for the 10 USDC or 10 WLD creation fee. Fund your wallet or switch payment token.'
  }
  if (haystack.includes('insufficient allowance') || haystack.includes('InsufficientAllowance')) {
    return 'Insufficient token allowance. Approve the creation fee in your wallet and try again.'
  }

  if (haystack.includes('User rejected')) {
    return 'Transaction cancelled in wallet.'
  }

  return error.message || 'Transaction failed.'
}
