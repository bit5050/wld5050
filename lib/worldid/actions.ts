/** World ID action strings — must match WLD5050.sol externalNullifier suffixes. */
export const WORLD_ID_CREATE_ACTION = 'create-raffle'

export function worldIdEnterRaffleAction(raffleId: number | bigint): string {
  return `enter-raffle-${raffleId}`
}
