import { ethers } from 'hardhat'

async function main() {
  const raffleId = Number(process.env.RAFFLE_ID ?? 1)
  const address = process.env.WLD5050_CONTRACT ?? '0x787C5b5B464CEa2D1482e3f0e605171B1f0D322E'
  const c = await ethers.getContractAt('WLD5050', address)
  const details = await c.getRaffleDetails(raffleId)
  const state = await c.getRaffleState(raffleId)
  const expired = await c.getExpiredRaffles()
  const block = await ethers.provider.getBlock('latest')

  console.log(
    JSON.stringify(
      {
        raffleId,
        name: details[0],
        ticketsSold: details[3].toString(),
        endTime: details[4].toString(),
        status: details[5].toString(),
        isEnded: state[6],
        stateStatus: state[7].toString(),
        expired: expired.map((x: bigint) => x.toString()),
        forwarder: await c.creForwarder(),
        raffleCount: (await c.raffleCount()).toString(),
        blockTimestamp: block?.timestamp,
        endTimePassed: block ? block.timestamp >= Number(details[4]) : null,
      },
      null,
      2,
    ),
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
