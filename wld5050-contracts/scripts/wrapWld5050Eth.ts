/**
 * One-time setup: wrap wld5050.eth in ENS NameWrapper so WinnerEnsClaimRegistrar
 * (and NameWrapper.setSubnodeRecord) can mint winner-round{N}.wld5050.eth subnames.
 *
 * Without this, claim txs revert with NameWrapper Unauthorised (0xb455aae8).
 *
 * Usage:
 *   npm run ens-claim:wrap
 *   npm run ens-claim:wrap -- --dry-run
 */
import * as dotenv from "dotenv"
import { ethers } from "ethers"
import { createPublicClient, http, keccak256, toBytes } from "viem"
import { namehash } from "viem/ens"
import { mainnet } from "viem/chains"

dotenv.config()

const ENS_NAME_WRAPPER = "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401"
const BASE_REGISTRAR = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
const ENS_PUBLIC_RESOLVER = "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63"
const ETH_LABEL = "wld5050"

const baseRegistrarAbi = [
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)",
  "function nameExpires(uint256 id) view returns (uint256)",
] as const

const nameWrapperAbi = [
  "function isWrapped(bytes32 node) view returns (bool)",
  "function wrapETH2LD(string label, address wrappedOwner, uint16 ownerControlledFuses, address resolver, uint64 duration) returns (uint64 expiry)",
  "function ownerOf(uint256 id) view returns (address)",
] as const

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name)
  return idx >= 0 ? process.argv[idx + 1] : undefined
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")
  const registrar =
    getArg("--registrar") ??
    process.env.WINNER_ENS_CLAIM_REGISTRAR ??
    process.env.NEXT_PUBLIC_WINNER_ENS_CLAIM_REGISTRAR

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

  const readClient = createPublicClient({ chain: mainnet, transport: http(rpcUrl) })
  const labelHash = keccak256(toBytes(ETH_LABEL))
  const node = namehash("wld5050.eth")
  const nodeId = BigInt(node)

  console.log("wld5050.eth controller:", owner.address)
  if (registrar) console.log("Claim registrar:", registrar)

  const baseRegistrar = new ethers.Contract(BASE_REGISTRAR, baseRegistrarAbi, owner)
  const nameWrapper = new ethers.Contract(ENS_NAME_WRAPPER, nameWrapperAbi, owner)

  const wrapped = await nameWrapper.isWrapped(node)
  console.log("isWrapped(wld5050.eth):", wrapped)

  if (wrapped) {
    const wrapperOwner = await nameWrapper.ownerOf(nodeId)
    console.log("NameWrapper ownerOf(wld5050.eth):", wrapperOwner)
    console.log("Already wrapped — no wrap tx needed.")
    return
  }

  const baseApproved = await baseRegistrar.isApprovedForAll(owner.address, ENS_NAME_WRAPPER)
  console.log("BaseRegistrar approved NameWrapper:", baseApproved)

  const expiry = await baseRegistrar.nameExpires(labelHash)
  const now = BigInt(Math.floor(Date.now() / 1000))
  const duration = expiry > now ? expiry - now : 365n * 24n * 60n * 60n
  console.log("Wrap duration (seconds):", duration.toString())

  if (dryRun) {
    console.log("\nDry run — would send:")
    if (!baseApproved) console.log("  1. BaseRegistrar.setApprovalForAll(NameWrapper, true)")
    console.log(`  ${baseApproved ? "1" : "2"}. NameWrapper.wrapETH2LD("${ETH_LABEL}", …)`)
    return
  }

  if (!baseApproved) {
    console.log("Approving NameWrapper on .eth BaseRegistrar…")
    const approveTx = await baseRegistrar.setApprovalForAll(ENS_NAME_WRAPPER, true)
    console.log("  tx:", approveTx.hash)
    await approveTx.wait()
  }

  console.log("Wrapping wld5050.eth in NameWrapper…")
  const wrapTx = await nameWrapper.wrapETH2LD(
    ETH_LABEL,
    owner.address,
    0,
    ENS_PUBLIC_RESOLVER,
    duration,
  )
  console.log("  tx:", wrapTx.hash)
  await wrapTx.wait()

  const wrappedAfter = await readClient.readContract({
    address: ENS_NAME_WRAPPER as `0x${string}`,
    abi: [
      {
        name: "isWrapped",
        type: "function",
        stateMutability: "view",
        inputs: [{ type: "bytes32" }],
        outputs: [{ type: "bool" }],
      },
    ],
    functionName: "isWrapped",
    args: [node],
  })

  if (!wrappedAfter) {
    throw new Error("Wrap tx confirmed but wld5050.eth still reports unwrapped")
  }

  const wrapperOwner = await readClient.readContract({
    address: ENS_NAME_WRAPPER as `0x${string}`,
    abi: [
      {
        name: "ownerOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ type: "uint256" }],
        outputs: [{ type: "address" }],
      },
    ],
    functionName: "ownerOf",
    args: [nodeId],
  })

  console.log("\nSuccess — wld5050.eth is wrapped.")
  console.log("NameWrapper owner:", wrapperOwner)

  if (registrar) {
    console.log("\nNext: ensure registrar is approved (if not already):")
    console.log(`  npm run ens-claim:approve -- --registrar ${registrar}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
