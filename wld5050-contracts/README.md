# WLD5050 — Backend Smart Contract Integrations

## The Killer Use Case

**WLD5050 is the first 50/50 raffle where:**
1. **Bots cannot enter** — World ID ZK proof verified onchain, 1 entry per human
2. **No one can manipulate the draw** — Chainlink CRE DON of 15 independent nodes runs it
3. **No claiming step exists** — USDC pushed atomically to winner + creator in one tx
4. **Every actor has a human-readable identity** — ENS names, zero hex addresses in UI
5. **Every draw is AI-attested** — Chainlink Confidential AI fairness hash written onchain

---

## Integration Map

```
USER (World ID verified human)
    │
    │  buyTicket(raffleId, root, nullifierHash, proof)
    │  ↓ World ID ZK proof verified onchain
    ▼
WLD5050.sol (World Chain, Chain ID 480)
    │
    │  IWorldID.verifyProof() ← WorldIDRouter on World Chain
    │  USDC held in escrow until settlement
    │
    │  [every 30 seconds, automatically]
    ▼
Chainlink CRE Workflow (wld5050-workflow.ts)
    │
    ├─ evmClient.read("getExpiredRaffles")     ← World Chain onchain read
    ├─ fetch(AgentKit /trigger-draw)           ← external API: human-backed agent check
    ├─ confidentialHttp(Confidential AI)       ← TEE: fairness attestation
    ├─ runtime.Rand()                          ← BFT consensus randomness
    └─ evmClient.write("onReport")             ← World Chain onchain write (via Forwarder)
         │
         ▼
    WLD5050.onReport() called by Chainlink KeystoneForwarder
         │
         ├─ aiAttestationHash stored onchain
         ├─ USDC.transfer(winner, 50%)         ← PUSH — no claiming
         ├─ USDC.transfer(creator, 50%)        ← PUSH — same transaction
         └─ emit RaffleSettled(winnerSubname)
              │
              ▼
    mintWinnerSubname.ts (Node.js listener)
         │
         └─ ENS NameWrapper.setSubnodeRecord() ← Ethereum L1
              winner-round{N}.wld5050.eth → winner's address (permanent)
```

---

## Files

```
contracts/
├── WLD5050.sol                    ← Main contract (World ID + Chainlink CRE IReceiver)
├── interfaces/
│   ├── IWorldID.sol               ← World ID ZK proof verification interface
│   ├── IReceiver.sol              ← Chainlink CRE consumer contract interface
│   └── IENS.sol                   ← ENS NameWrapper + Resolver interfaces
└── libraries/
    └── ByteHasher.sol             ← World ID signal/nullifier hashing helper

workflow/
└── wld5050-workflow.ts            ← Chainlink CRE TypeScript workflow
    ├── Cron trigger (every 30 seconds — CRE minimum interval)
    ├── Read: getExpiredRaffles()
    ├── External API: AgentKit human-backed verification
    ├── Confidential HTTP: AI fairness attestation (TEE)
    ├── Randomness: runtime.Rand() BFT consensus
    └── Write: onReport() → USDC push payments

scripts/
├── deploy.ts                      ← Deploy WLD5050.sol to World Chain Sepolia
└── mintWinnerSubname.ts           ← Listen for RaffleSettled → mint ENS subname on L1
```

---

## World ID Integration Detail

### What's integrated
- `IWorldID.verifyProof()` called inside `WLD5050.buyTicket()`
- `ByteHasher.hashToField()` used to hash signal and external nullifier
- `nullifierUsed[raffleId][nullifierHash]` mapping prevents same human re-entering
- `externalNullifierHash` scoped per raffle: `hash(APP_ID + "enter-raffle-" + raffleId)`
- `GROUP_ID = 1` enforces Orb-verified humans only

### What breaks without it
Remove `worldId.verifyProof()` and the contract accepts any wallet. A whale with 1,000 wallets controls 99.9% of the pot. A bot farm enters in milliseconds. The 50/50 guarantee is false.

### Addresses (World Chain Sepolia)
```
WorldIDRouter: 0x469449f251692E0779667583026b5A1E99512157
USDC:          0x79A02482A880bCE3F13e09Da970dC34db4CD24d1 (mainnet — confirm Sepolia)
```

---

## Chainlink CRE Integration Detail

### What's integrated
1. **IReceiver interface** — `WLD5050.sol` implements `onReport(bytes metadata, bytes report)`
2. **IERC165** — declares `IReceiver` support (required by Chainlink Forwarder)
3. **Cron trigger** — CRE workflow fires every 30 seconds via cron capability (`*/30 * * * * *`)
4. **Onchain read** — `getExpiredRaffles()` and `getRaffleState()` read from World Chain
5. **External API** — `runtime.fetch()` calls AgentKit `/trigger-draw` endpoint
6. **Confidential HTTP** — `runtime.confidentialHttp.request()` calls Chainlink Confidential AI
7. **Consensus randomness** — `runtime.Rand().Intn(ticketsSold)` selects winner index
8. **Onchain write** — CRE Forwarder calls `WLD5050.onReport()` on World Chain

### The state changes in `onReport()` (satisfies "Connect the World" prize requirement)
1. `raffle.aiAttestationHash = aiAttestationHash` — AI attestation stored
2. `raffle.status = RaffleStatus.SETTLED` — raffle marked settled
3. `usdc.transfer(winner, winnerPrize)` — 50% USDC pushed to winner
4. `usdc.transfer(creator, creatorPayout)` — 50% USDC pushed to creator
5. `emit RaffleSettled(...)` — event triggers ENS subname minting

### Security
- `onlyForwarder` modifier: `if (msg.sender != creForwarder) revert OnlyForwarder()`
- `IERC165.supportsInterface()` declares `IReceiver` for Forwarder validation
- `require(raffle.status == ACTIVE)` prevents double settlement
- `require(block.timestamp >= raffle.endTime)` prevents early settlement

### CRE Workflow simulation
```bash
# Install CRE CLI (macOS/Linux)
brew install chainlink/tap/cre

# Or download binary
curl -sSL https://github.com/smartcontractkit/cre-cli/releases/latest -o cre
chmod +x cre && mv cre /usr/local/bin/

# Login (get org membership from Chainlink booth)
cre login

# Simulate workflow (produces execution log for judges)
cd workflow && bun install && cd ..
cre workflow simulate workflow --target production-settings --non-interactive --trigger-index 0

# Deploy (Chainlink team or cre workflow deploy)
cre workflow deploy workflow --target production-settings
```

---

## ENS Integration Detail

### Three layers

**1. Contract identity — `wld5050.eth`**
- The `platformWallet` constructor param is set to the resolved address of `wld5050.eth`
- All $10 creation fees flow to `wld5050.eth`
- The frontend resolves all hex addresses to ENS names via `viem.getEnsName()`

**2. Agent identity — `agent.wld5050.eth`**
- The CRE workflow agent address is registered as `agent.wld5050.eth` in ENS
- Text records store: AgentBook address, x402 payment endpoint, CRE workflow hash
- Displayed in the draw verification panel: "Draw by agent.wld5050.eth"

**3. Winner provenance — `winner-round{N}.wld5050.eth`**
- `RaffleSettled` event emits `winnerSubname = "winner-round42.wld5050.eth"`
- `mintWinnerSubname.ts` listens on World Chain, calls ENS NameWrapper on L1
- Uses `NameWrapper.setSubnodeRecord(wld5050Node, "winner-round42", winner, resolver, 0, 0, 0)`
- Winner receives a permanent ENS subname NFT — their onchain proof of winning

### ENS display rule (frontend)
```typescript
// RULE: never show hex addresses to users
// Every address goes through resolveENS() before display
const name = await resolveENS(address)
const display = name ?? truncateAddress(address)  // alice.eth or 0x1234...5678
```

---

## Deployment Checklist

### Before deploying
- [ ] Get CRE KeystoneForwarder address for World Chain Mainnet (480) from Chainlink booth
- [ ] Confirm WorldIDRouter address on World Chain Mainnet with World team
- [ ] Resolve `wld5050.eth` → `PLATFORM_WALLET` (`npm run resolve:ens`)
- [ ] Set `PRIVATE_KEY` and `WORLD_CHAIN_RPC_URL` in `wld5050-contracts/.env`
- [ ] Set `OPERATOR_PRIVATE_KEY` for ENS subname minting (controls `wld5050.eth`)

### Deploy sequence
```bash
cd wld5050-contracts
npm install
# Create .env locally — see Environment Variables below (do not commit)
npm run resolve:ens             # optional: resolve wld5050.eth → PLATFORM_WALLET
npx hardhat compile
npm run deploy:mainnet

# Post-deploy
# 1. Update NEXT_PUBLIC_WLD5050_CONTRACT in root .env.local
# 2. Update WLD5050_CONTRACT in workflow/wld5050-workflow.ts
# 3. Simulate CRE workflow
cre workflow simulate --workflow workflow/wld5050-workflow.ts
# 4. Show simulation log to Chainlink team → they deploy to live DON
# 5. Start ENS subname minter
npx ts-node scripts/mintWinnerSubname.ts
# 6. Test full flow on mainnet
#    createRaffle() → buyTicket() → wait for round end → CRE fires → check balances
```

---

## Environment Variables

### wld5050-contracts/.env (deploy — create locally, never commit)
```bash
PRIVATE_KEY=
OPERATOR_PRIVATE_KEY=
WORLD_CHAIN_RPC_URL=https://worldchain-mainnet.g.alchemy.com/v2/YOUR_KEY
ETH_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
WORLD_ID_ROUTER=0x17B354dD3F6C1ef9B44E4247CC9Fe57A30F9f5d7
USDC_ADDRESS=0x79A02482A880bCE3F13e09Da970dC34db4CD24d1
WLD_ADDRESS=0x2cFc85d8E48F8EAB294be644d9E25C3030863003
CRE_FORWARDER=
PLATFORM_WALLET=
WLD5050_CONTRACT=
ENS_NAME=wld5050.eth
```

### Runtime (frontend + scripts)
```bash
# World Chain
WORLD_CHAIN_RPC_URL=https://worldchain-mainnet.g.alchemy.com/v2/YOUR_KEY
WLD5050_CONTRACT=0x...

# Ethereum L1 (ENS subname minting)
ETH_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
OPERATOR_PRIVATE_KEY=...

# World ID (frontend)
NEXT_PUBLIC_WLD_APP_ID=app_xxxxx
NEXT_PUBLIC_WLD_ACTION=enter-raffle   # base action; contract uses enter-raffle-{raffleId}

# Chainlink CRE (workflow secrets)
CHAINLINK_CONFIDENTIAL_AI_URL=https://...
CHAINLINK_CONFIDENTIAL_AI_KEY=...

# Privy (frontend)
NEXT_PUBLIC_PRIVY_APP_ID=xxxxx
```

---

*WLD5050 · ETHGlobal New York 2026 · BIT5050 INC. · "All Product. All Service. No Token."*
