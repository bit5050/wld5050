import { decodeEventLog, type Address, type TransactionReceipt } from 'viem'
import { wld5050Abi } from '@/lib/contracts/wld5050'

export function parseRaffleIdFromReceipt(
  receipt: TransactionReceipt,
  contractAddress: Address,
): number | null {
  const target = contractAddress.toLowerCase()

  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== target) continue

    try {
      const decoded = decodeEventLog({
        abi: wld5050Abi,
        data: log.data,
        topics: log.topics,
      })

      if (decoded.eventName === 'RaffleCreated') {
        return Number(decoded.args.raffleId)
      }
    } catch {
      // not a RaffleCreated log
    }
  }

  return null
}
