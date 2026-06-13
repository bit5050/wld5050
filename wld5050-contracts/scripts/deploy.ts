/**
 * deploy.ts — Deploy WLD5050.sol to World Chain MAINNET
 *
 * World Chain Mainnet ChainID: 480
 * RPC: https://worldchain-mainnet.g.alchemy.com/public
 * Explorer: https://worldscan.org
 *
 * Run: npm run deploy:mainnet
 */
import { ethers } from "hardhat"

const PLACEHOLDER_ADDRESSES = new Set([
  "",
  "0x0000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000001",
  "0x0000000000000000000000000000000000000002",
])

function requireAddress(name: string, value: string | undefined, required = true): string {
  if (!value || value.trim() === "") {
    if (required) {
      throw new Error(`Missing required env var: ${name}`)
    }
    throw new Error(`Missing env var: ${name}`)
  }

  const trimmed = value.trim()

  if (!ethers.isAddress(trimmed)) {
    throw new Error(`Invalid address for ${name}: ${trimmed}`)
  }

  if (PLACEHOLDER_ADDRESSES.has(trimmed.toLowerCase())) {
    throw new Error(`${name} is a placeholder — set a real address in .env`)
  }

  return ethers.getAddress(trimmed)
}

async function main() {
  const [deployer] = await ethers.getSigners()
  const network    = await ethers.provider.getNetwork()
  const balance    = await ethers.provider.getBalance(deployer.address)

  console.log("═══════════════════════════════════════════════════")
  console.log("  WLD5050 — MAINNET DEPLOYMENT")
  console.log("  ETHGlobal New York 2026 · BIT5050 INC.")
  console.log("═══════════════════════════════════════════════════")
  console.log(`  Network:   ${network.name} (chainId: ${network.chainId})`)
  console.log(`  Deployer:  ${deployer.address}`)
  console.log(`  Balance:   ${ethers.formatEther(balance)} ETH`)
  console.log("═══════════════════════════════════════════════════")

  const WORLD_ID_ROUTER = requireAddress("WORLD_ID_ROUTER", process.env.WORLD_ID_ROUTER)
  const USDC            = requireAddress("USDC_ADDRESS", process.env.USDC_ADDRESS)
  const WLD             = requireAddress("WLD_ADDRESS", process.env.WLD_ADDRESS)
  const CRE_FORWARDER   = requireAddress("CRE_FORWARDER", process.env.CRE_FORWARDER)
  const PLATFORM_WALLET = requireAddress("PLATFORM_WALLET", process.env.PLATFORM_WALLET)

  if (network.chainId !== 480n) {
    throw new Error(
      `Wrong network! Expected World Chain Mainnet (480), got ${network.chainId}.\n` +
      `Run: npm run deploy:mainnet`
    )
  }

  console.log("\nDeployment parameters:")
  console.log(`  WorldIDRouter:   ${WORLD_ID_ROUTER}`)
  console.log(`  USDC:            ${USDC}`)
  console.log(`  WLD:             ${WLD}`)
  console.log(`  CRE Forwarder:   ${CRE_FORWARDER}`)
  console.log(`  Platform wallet: ${PLATFORM_WALLET}`)

  console.log("\nToken amounts (Option B — fixed, no oracle):")
  console.log(`  USDC creation fee: $10.00 = 10_000_000 (6 dec)`)
  console.log(`  USDC ticket price:  $2.50 =  2_500_000 (6 dec)`)
  console.log(`  WLD  creation fee: 10 WLD = 10e18      (18 dec)`)
  console.log(`  WLD  ticket price: 2.5 WLD = 2.5e18    (18 dec)`)

  console.log("\nDeploying WLD5050 to World Chain Mainnet...")
  const Factory  = await ethers.getContractFactory("WLD5050")
  const contract = await Factory.deploy(
    WORLD_ID_ROUTER,
    USDC,
    WLD,
    CRE_FORWARDER,
    PLATFORM_WALLET
  )
  await contract.waitForDeployment()
  const address = await contract.getAddress()

  console.log("\n═══════════════════════════════════════════════════")
  console.log("  ✓ WLD5050 DEPLOYED SUCCESSFULLY")
  console.log("═══════════════════════════════════════════════════")
  console.log(`  Contract:  ${address}`)
  console.log(`  Explorer:  https://worldscan.org/address/${address}`)
  console.log("═══════════════════════════════════════════════════")

  console.log("\nVerifying deployment parameters onchain...")
  console.log(`  worldId:        ${await contract.worldId()}`)
  console.log(`  usdc:           ${await contract.usdc()}`)
  console.log(`  wld:            ${await contract.wld()}`)
  console.log(`  creForwarder:   ${await contract.creForwarder()}`)
  console.log(`  platformWallet: ${await contract.platformWallet()}`)
  console.log(`  raffleCount:    ${await contract.raffleCount()}`)
  console.log(`  PLATFORM_FEE_USDC: ${await contract.PLATFORM_FEE_USDC()} ($10.00 USDC)`)
  console.log(`  TICKET_PRICE_USDC: ${await contract.TICKET_PRICE_USDC()} ($2.50 USDC)`)
  console.log(`  PLATFORM_FEE_WLD:  ${ethers.formatEther(await contract.PLATFORM_FEE_WLD())} WLD`)
  console.log(`  TICKET_PRICE_WLD:  ${ethers.formatEther(await contract.TICKET_PRICE_WLD())} WLD`)

  console.log("\n── Next steps ──────────────────────────────────────")
  console.log(`1. Update root .env.local:`)
  console.log(`   NEXT_PUBLIC_WLD5050_CONTRACT=${address}`)
  console.log(`2. Update workflow/wld5050-workflow.ts:`)
  console.log(`   WLD5050_CONTRACT = "${address}"`)
  console.log(`3. Register World ID app in Developer Portal:`)
  console.log(`   https://developer.worldcoin.org`)
  console.log(`   App ID: app_wld5050 (update APP_ID in contract if different)`)
  console.log(`4. Simulate CRE workflow:`)
  console.log(`   cre workflow simulate workflow/wld5050-workflow.ts`)
  console.log(`5. Show simulation log to Chainlink team → they deploy to live DON`)
  console.log(`6. Test createRaffle() with real USDC/WLD on World Chain Mainnet`)
  console.log("────────────────────────────────────────────────────")
}

main().catch(e => { console.error(e); process.exit(1) })
