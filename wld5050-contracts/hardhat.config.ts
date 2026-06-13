import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "0x" + "0".repeat(64)

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    "worldchain-mainnet": {
      url: process.env.WORLD_CHAIN_RPC_URL
        ?? "https://worldchain-mainnet.g.alchemy.com/public",
      chainId: 480,
      accounts: [PRIVATE_KEY],
    },
  },
}

export default config
