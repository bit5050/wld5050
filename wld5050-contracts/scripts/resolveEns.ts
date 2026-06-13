/**
 * resolveEns.ts — Resolve wld5050.eth to an Ethereum address for PLATFORM_WALLET
 *
 * Run: npm run resolve:ens
 * Optional: ENS_NAME=wld5050.eth ETH_MAINNET_RPC_URL=...
 */
import * as dotenv from "dotenv"
import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"

dotenv.config()

async function main() {
  const ensName = process.env.ENS_NAME ?? "wld5050.eth"
  const rpcUrl = process.env.ETH_MAINNET_RPC_URL

  if (!rpcUrl?.trim()) {
    console.error(
      "Missing ETH_MAINNET_RPC_URL in wld5050-contracts/.env\n" +
        "Add your Ethereum mainnet RPC (Alchemy/Infura) — the public Alchemy demo endpoint is rate-limited."
    )
    process.exit(1)
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  })

  console.log(`Resolving ${ensName}...`)
  const address = await client.getEnsAddress({ name: ensName })

  if (!address) {
    console.error(`Could not resolve ${ensName}. Check the name is registered and RPC is valid.`)
    process.exit(1)
  }

  console.log(`\n${ensName} → ${address}`)
  console.log(`\nAdd to wld5050-contracts/.env:`)
  console.log(`PLATFORM_WALLET=${address}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
