/**
 * verifyWinnerEnsClaimRegistrar.ts — Publish source on Etherscan (Ethereum mainnet)
 *
 * Run: npm run ens-claim:verify
 */
import { run } from "hardhat"
import { namehash } from "viem/ens"

const REGISTRAR = "0xef9ad4bd204eace9d2b2a0f53326c7e83e8c49f9"
const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
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
      ENS_REGISTRY,
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
