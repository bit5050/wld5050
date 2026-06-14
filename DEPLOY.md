# WLD5050 deployment checklist

Complete these steps **in order**. Skipping a step is the most common reason World ID or CRE fails in production.

---

## Phase 1 — World ID Developer Portal

1. Open [World Developer Portal](https://developer.worldcoin.org).
2. Use the same **App ID** in the portal and in `WLD5050.sol` `APP_ID` (must match `NEXT_PUBLIC_WLD_APP_ID`).
3. Register actions:
   - `create-raffle` — required for raffle creation
   - `enter-raffle-{id}` — one action per raffle for ticket purchase (dynamic in the app)
4. Create a **Relying Party (RP)** and copy:
   - `rp_id` → `WORLD_RP_ID`
   - RP **signing key** (hex) → `WORLD_RP_SIGNING_KEY` (server only, never `NEXT_PUBLIC_`)

---

## Phase 2 — Deploy smart contract (World Chain mainnet)

```bash
cd wld5050-contracts
cp env.example .env          # fill PRIVATE_KEY + confirm addresses
npm install
npm run compile
npm run deploy:mainnet
```

Copy the printed contract address into:

| Where | Variable / field |
|-------|------------------|
| Root `.env.local` | `NEXT_PUBLIC_WLD5050_CONTRACT=0x…` |
| Vercel env | Same |
| `wld5050-contracts/workflow/config.production.json` | `"wld5050Contract": "0x…"` |

**Contract includes:** World ID on `createRaffle` + `buyTicket`, open duration (1s+), CRE `onReport` settlement.

---

## Phase 3 — Deploy frontend (Vercel)

Set **all** of these in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_WLD_APP_ID=app_…          # must match contract APP_ID
WORLD_RP_ID=rp_…                       # server only — not in contract
WORLD_RP_SIGNING_KEY=0x…
NEXT_PUBLIC_PRIVY_APP_ID=…
NEXT_PUBLIC_WLD5050_CONTRACT=0x…
NEXT_PUBLIC_CHAIN_ID=480
WORLD_RP_ID=rp_…
WORLD_RP_SIGNING_KEY=0x…
PRIVY_APP_SECRET=…
WORLD_CHAIN_RPC_URL=…
ETH_MAINNET_RPC_URL=…
```

Then push to `main` (Vercel auto-deploys):

```bash
git add -A && git commit -m "…" && git push origin main
```

**Verify after deploy:**

- `/create` — Connect Privy → Verify World ID → create raffle
- `/api/worldid/rp-context?action=create-raffle` — returns JSON (not 503)
- `/api/trigger-draw` — POST returns `{ ok: true }`

---

## Phase 4 — Deploy CRE workflow (30s settlement)

CRE polls **`*/30 * * * * *`** (every 30 seconds). Settlement lands within ~0–30s after raffle end.

```bash
# Install CRE CLI: brew install chainlink/tap/cre && cre login
cd wld5050-contracts/workflow
bun install
cd ..

# Edit config.production.json — set real wld5050Contract address (not placeholder)

cre workflow simulate workflow --target production-settings --non-interactive --trigger-index 0

cre workflow deploy workflow --target production-settings
cre workflow activate workflow --target production-settings
```

**Confirm:**

- `config.production.json` → `"schedule": "*/30 * * * * *"`
- `chainSelectorName` → `"ethereum-mainnet-worldchain-1"`
- Contract `creForwarder` matches `CRE_FORWARDER` in `.env` (`0x98B8335…` for production CRE deploy)

### Hackathon fallback (no CRE deploy access)

Deploy with **mock** forwarder for manual settlement via CRE simulate broadcast:

```bash
# In wld5050-contracts/.env before deploy:
CRE_FORWARDER=0x6E9EE680ef59ef64Aa8C7371279c27E496b5eDc1
npm run deploy:mainnet
```

After each raffle ends, from `wld5050-contracts/`:

```bash
cre workflow simulate workflow \
  --target production-settings \
  --non-interactive \
  --trigger-index 0 \
  --broadcast \
  -e .env
```

Requires `CRE_ETH_PRIVATE_KEY` in `.env` and World Chain ETH for gas. Current hackathon contract: `0x787C5b5B464CEa2D1482e3f0e605171B1f0D322E`.

---

## Phase 5 — Smoke test (hackathon demo)

1. **Create** — `/create` → 1 min preset → World ID → pay $10 USDC
2. **Buy** — `/raffle/{id}` → World ID → pay $2.50 USDC
3. **Wait** — raffle end + up to 30s for CRE cron
4. **Verify** — winner + creator receive USDC on [worldscan.org](https://worldscan.org)

Optional: run `npm run mint-winner` listener for ENS subnames (separate script).

---

## Quick troubleshooting

| Symptom | Fix |
|---------|-----|
| “Set NEXT_PUBLIC_WLD_APP_ID” | Add app id to Vercel + `.env.local` |
| RP context 503 | Set `WORLD_RP_ID` + `WORLD_RP_SIGNING_KEY` on Vercel |
| World ID verify fails on-chain | App id must match contract `APP_ID`; action must be `create-raffle` or `enter-raffle-{id}` |
| Create/buy tx reverts | Redeployed contract? USDC approved? Wallet on World Chain (480)? |
| `NonExistentRoot` / proof revert on create | World ID proof expired — verify again **immediately** before submit (do not verify early) |
| Vercel shows raffles from wrong contract | Set `NEXT_PUBLIC_WLD5050_CONTRACT=0x787C5b5B464CEa2D1482e3f0e605171B1f0D322E` on Vercel and **redeploy** (app also falls back to this address in code) |
| Raffle never settles | CRE workflow deployed + active? Contract address in workflow config? |
| Settlement > 30s | CRE not active or wrong contract in workflow config |
