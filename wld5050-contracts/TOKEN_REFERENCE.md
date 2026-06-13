# WLD5050 Token Reference — Option B (Fixed Amounts, No Oracle)

## World Chain Mainnet Token Addresses

| Token | Address | Decimals |
|---|---|---|
| USDC | `0x79A02482A880bCE3F13e09Da970dC34db4CD24d1` | 6 |
| WLD  | `0x2cFc85d8E48F8EAB294be644d9E25C3030863003` | 18 |

---

## Fixed Amounts — Hardcoded in Contract

| Action | USDC | Raw USDC units | WLD | Raw WLD units |
|---|---|---|---|---|
| Create raffle | $10.00 | `10_000_000` | 10.00 WLD | `10_000_000_000_000_000_000` |
| Buy ticket | $2.50 | `2_500_000` | 2.50 WLD | `2_500_000_000_000_000_000` |

## Settlement Math

| Tickets sold | USDC winner | USDC creator | WLD winner | WLD creator |
|---|---|---|---|---|
| 1 | $1.25 | $1.25 | 1.25 WLD | 1.25 WLD |
| 10 | $12.50 | $12.50 | 12.50 WLD | 12.50 WLD |
| 100 | $125.00 | $125.00 | 125.00 WLD | 125.00 WLD |
| 1,000 | $1,250.00 | $1,250.00 | 1,250 WLD | 1,250 WLD |

Platform also earns $10.00 USDC (or 10 WLD) per raffle created — separate from ticket revenue.

---

## Design Decisions

**Why fixed amounts?**
- No Chainlink oracle dependency on World Chain (WLD/USD price feed not confirmed live)
- Simpler contract — no oracle read, no price computation, no staleness check
- Faster to audit and demo at a hackathon
- Creator and buyer both know exactly what they pay in their chosen token

**Why the WLD amount chosen?**
- At hackathon time ~$2.00-2.50/WLD (confirm current price)
- 5 WLD creation fee ≈ $10-12 USD
- 1.25 WLD ticket price ≈ $2.50-3.13 USD
- Intentionally kept close to USDC equivalent so both tracks feel fair

**Why same token per raffle?**
- Simplest escrow logic — one token in, same token out
- No Uniswap swap risk inside the contract
- Creator picks their preferred token at creation
- Buyers know immediately what they're playing with

**Post-hackathon upgrade path:**
- Add Chainlink WLD/USD Price Feed when it's confirmed on World Chain
- Convert to Option A (USD-denominated) — 1 line change in `createRaffle` and `buyTicket`
- The rest of the contract stays identical

---

## User Approval Requirements

Before calling `createRaffle()`:
```
// USDC raffle
usdcContract.approve(WLD5050_ADDRESS, 10_000_000)  // $10.00

// WLD raffle
wldContract.approve(WLD5050_ADDRESS, 10_000_000_000_000_000_000)  // 10 WLD
```

Before calling `buyTicket()`:
```
// USDC ticket
usdcContract.approve(WLD5050_ADDRESS, 2_500_000)  // $2.50

// WLD ticket
wldContract.approve(WLD5050_ADDRESS, 2_500_000_000_000_000_000)  // 2.50 WLD
```

Frontend (Next.js + wagmi) handles these approvals automatically before the main tx.
