/**
 * Deploy WinnerEnsClaimRegistrar on Ethereum mainnet.
 *
 * After deploy, run:
 *   npm run ens-claim:approve -- --registrar <address>
 */
import { ethers } from "hardhat"
import { namehash } from "viem/ens"

const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
const ENS_PUBLIC_RESOLVER = "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"
const WLD5050_ETH_NODE = namehash("wld5050.eth")

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deployer:", deployer.address)
  console.log("Claim signer:", deployer.address)

  const factory = await ethers.getContractFactory("WinnerEnsClaimRegistrar")
  const registrar = await factory.deploy(
    ENS_REGISTRY,
    deployer.address,
    WLD5050_ETH_NODE,
    ENS_PUBLIC_RESOLVER,
  )
  await registrar.waitForDeployment()

  const address = await registrar.getAddress()
  console.log("\nWinnerEnsClaimRegistrar deployed:", address)
  console.log("\nNext steps:")
  console.log(`  1. Set NEXT_PUBLIC_WINNER_ENS_CLAIM_REGISTRAR=${address}`)
  console.log(`  2. npm run ens-claim:approve -- --registrar ${address}`)
  console.log("  3. Verify on Etherscan if desired")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
