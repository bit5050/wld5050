/**
 * verify.ts — Publish WLD5050 source on Worldscan (World Chain mainnet)
 *
 * Requires ETHERSCAN_API_KEY or WORLDSCAN_API_KEY in .env
 * (free key from https://etherscan.io/myapikey works for chain 480)
 *
 * Run: npm run verify:mainnet
 */
import { run } from "hardhat"

async function main() {
  const address = process.env.WLD5050_CONTRACT?.trim()
    ?? "0x787C5b5B464CEa2D1482e3f0e605171B1f0D322E"

  const worldId = process.env.WORLD_ID_ROUTER?.trim()
    ?? "0x17B354dD2595411ff79041f930e491A4Df39A278"
  const usdc = process.env.USDC_ADDRESS?.trim()
    ?? "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1"
  const wld = process.env.WLD_ADDRESS?.trim()
    ?? "0x2cFc85d8E48F8EAB294be644d9E25C3030863003"
  const creForwarder = process.env.CRE_FORWARDER?.trim()
    ?? "0x6E9EE680ef59ef64Aa8C7371279c27E496b5eDc1"
  const platformWallet = process.env.PLATFORM_WALLET?.trim()
    ?? "0x655F553fF96791C225C97a07691C1CC198A223c4"

  if (!process.env.ETHERSCAN_API_KEY && !process.env.WORLDSCAN_API_KEY) {
    throw new Error(
      "Missing ETHERSCAN_API_KEY in .env — get a free key at https://etherscan.io/myapikey"
    )
  }

  console.log("Verifying WLD5050 on Worldscan (chain 480)...")
  console.log(`  Contract: ${address}`)

  await run("verify:verify", {
    address,
    constructorArguments: [
      worldId,
      usdc,
      wld,
      creForwarder,
      platformWallet,
    ],
  })

  console.log(`\n✓ Verified: https://worldscan.org/address/${address}#code`)
}

main().catch(e => { console.error(e); process.exit(1) })
