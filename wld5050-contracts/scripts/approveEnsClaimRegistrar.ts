/**
 * Grant WinnerEnsClaimRegistrar permission to mint subnames under wld5050.eth.
 *
 * The wallet controlling wld5050.eth on NameWrapper must run this once after deploy.
 *
 * Usage:
 *   npm run ens-claim:approve -- --registrar 0xYourRegistrarAddress
 */
import * as dotenv from "dotenv"
import { ethers } from "ethers"

dotenv.config()

const ENS_NAME_WRAPPER = "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401"

const nameWrapperAbi = [
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
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
  console.log("Approving registrar:", registrar)

  const nameWrapper = new ethers.Contract(ENS_NAME_WRAPPER, nameWrapperAbi, owner)
  const alreadyApproved = await nameWrapper.isApprovedForAll(owner.address, registrar)
  if (alreadyApproved) {
    console.log("Already approved — nothing to do.")
    return
  }

  const tx = await nameWrapper.setApprovalForAll(registrar, true)
  console.log("Tx submitted:", tx.hash)
  await tx.wait()
  console.log("Registrar approved on ENS NameWrapper.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
