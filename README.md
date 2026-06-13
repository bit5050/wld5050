# WLD5050

The first human-verified, fully automated 50/50 raffle on World Chain.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — black/white minimal design system
- **Space Grotesk** (display) + **Inter** (body) + **Space Mono** (numbers/addresses)
- **viem + wagmi** — Web3 + ENS resolution
- **@worldcoin/idkit** — World ID 4.0 ZK proof verification
- **@privy-io/react-auth** — embedded wallet onboarding
- **Chainlink CRE** — automated winner selection + prize distribution
- **ENS** — all hex addresses resolved to human-readable names

## Design System
- Background: `#FFFFFF`
- Text: `#000000`
- Borders: `0.5px solid #E0E0E0`
- Accent: `#00C853` (World ID verified green — used sparingly)
- No gradients. No shadows. No color other than green accent.

## Key Rule
Every hex address in the UI is resolved via `/api/ens` before display.
`Space Mono` renders all ENS names and numbers. Zero raw hex addresses shown to users.

## Pages
- `/` — Homepage: active raffles, hero, create CTA, last settlement
- `/create` — Create raffle: World ID gate, fee summary, duration picker
- `/raffle/[id]` — Individual raffle: buy ticket, World ID verify, live counter
- `/history` — Past settlements (to build)

## Getting Started
\`\`\`bash
cp .env.example .env.local   # fill in your keys locally
npm install
npm run dev
\`\`\`

## Environment Variables

Copy `.env.example` → `.env.local`. **Never commit `.env.local`** — this repo is public.

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_WLD_APP_ID` | Browser | World ID app id (public by design) |
| `NEXT_PUBLIC_WLD_ACTION` | Browser | World ID verification action |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Browser | Privy app id (public by design) |
| `NEXT_PUBLIC_WLD5050_CONTRACT` | Browser | Deployed contract address |
| `NEXT_PUBLIC_CHAIN_ID` | Browser | World Chain id (`480`) |
| `ETH_MAINNET_RPC_URL` | Server only | ENS lookups via `/api/ens` |
| `WORLD_CHAIN_RPC_URL` | Server only | On-chain reads / tx prep |
| `PRIVY_APP_SECRET` | Server only | Privy webhooks / server auth |
| `CHAINLINK_CRE_API_KEY` | Server only | CRE automation |

**Rule:** anything with a private key, RPC API key, or app secret must **not** use the `NEXT_PUBLIC_` prefix and must **not** be imported in Client Components. Use `lib/env.server.ts` on the server and `lib/env.public.ts` in the browser.
