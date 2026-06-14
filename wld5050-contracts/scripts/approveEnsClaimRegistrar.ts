/**
 * Grant WinnerEnsClaimRegistrar permission to mint subnames under wld5050.eth.
 *
 * Uses ENS registry setApprovalForAll (works with unwrapped wld5050.eth).
 *
 * Usage:
 *   npm run ens-claim:approve -- --registrar 0xYourRegistrarAddress
 */
import * as dotenv from "dotenv"
import { ethers } from "ethers"

dotenv.config()

const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"

const ensRegistryAbi = [
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
] as const

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name)
  return idx >= 0 ? process.argv[idx + 1] : undefined
}

async function main() {
  const registrar =
    getArg("--registrar") ?? process.env.WINNER_ENS_CLAIM_REGISTRAR
  if (!registrar || !/^0x[a-fA-F0-9]{40}$/.test(registrar)) {
    throw new Error("Pass --registrar 0x… or set WINNER_ENS_CLAIM_REGISTRAR")
  }

  const rpcUrl = process.env.ETH_MAINNET_RPC_URL
  if (!rpcUrl) throw new Error("ETH_MAINNET_RPC_URL is required")

  const operatorKey =
    process.env.OPERATOR_PRIVATE_KEY ??
    process.env.PRIVATE_KEY ??
    process.env.ENS_CLAIM_SIGNER_PRIVATE_KEY
  if (!operatorKey) {
    throw new Error("OPERATOR_PRIVATE_KEY, PRIVATE_KEY, or ENS_CLAIM_SIGNER_PRIVATE_KEY is required")
  }

  const normalizedKey = operatorKey.startsWith("0x") ? operatorKey : `0x${operatorKey}`

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const owner = new ethers.Wallet(normalizedKey, provider)

  console.log("wld5050.eth controller:", owner.address)
  console.log("Approving registrar on ENS registry:", registrar)

  const ens = new ethers.Contract(ENS_REGISTRY, ensRegistryAbi, owner)
  const alreadyApproved = await ens.isApprovedForAll(owner.address, registrar)
  if (alreadyApproved) {
    console.log("Already approved — nothing to do.")
    return
  }

  const tx = await ens.setApprovalForAll(registrar, true)
  console.log("Tx submitted:", tx.hash)
  await tx.wait()
  console.log("Registrar approved on ENS registry.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
