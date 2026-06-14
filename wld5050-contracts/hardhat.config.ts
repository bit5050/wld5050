import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"
dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "0x" + "0".repeat(64)
const WORLDSCAN_API_KEY = process.env.WORLDSCAN_API_KEY ?? process.env.ETHERSCAN_API_KEY ?? ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? ""

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
      evmVersion: "cancun",
    },
  },
  networks: {
    "worldchain-mainnet": {
      url: process.env.WORLD_CHAIN_RPC_URL
        ?? "https://worldchain-mainnet.g.alchemy.com/public",
      chainId: 480,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.ETH_MAINNET_RPC_URL ?? "https://cloudflare-eth.com",
      chainId: 1,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "worldchain-mainnet",
        chainId: 480,
        urls: {
          apiURL: "https://api.etherscan.io/v2/api",
          browserURL: "https://worldscan.org",
        },
      },
    ],
  },
}

export default config
