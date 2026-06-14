/**
 * verifyWinnerEnsClaimRegistrar.ts — Publish source on Etherscan (Ethereum mainnet)
 *
 * Run: npm run ens-claim:verify
 */
import { run } from "hardhat"
import { namehash } from "viem/ens"

const REGISTRAR = "0x695da60e4145c5df881df643681c6f0cf1f1b808"
const ENS_NAME_WRAPPER = "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401"
const CLAIM_SIGNER = "0x655F553fF96791C225C97a07691C1CC198A223c4"
const ENS_PUBLIC_RESOLVER = "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"
const WLD5050_ETH_NODE = namehash("wld5050.eth")

async function main() {
  if (!process.env.ETHERSCAN_API_KEY) {
    throw new Error("Missing ETHERSCAN_API_KEY in .env")
  }

  console.log("Verifying WinnerEnsClaimRegistrar on Etherscan...")
  console.log(`  Contract: ${REGISTRAR}`)

  await run("verify:verify", {
    address: REGISTRAR,
    constructorArguments: [
      ENS_NAME_WRAPPER,
      CLAIM_SIGNER,
      WLD5050_ETH_NODE,
      ENS_PUBLIC_RESOLVER,
    ],
  })

  console.log(`\nVerified: https://etherscan.io/address/${REGISTRAR}#code`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
