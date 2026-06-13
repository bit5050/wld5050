# WLD5050

The first human-verified, fully automated 50/50 raffle on World Chain.

## Stack
- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** — styling + design tokens (`tailwindcss`, `@tailwindcss/postcss`)
- **Radix UI** — accessible headless primitives (Dialog, Select, Tabs, Tooltip…)
- **Headless UI** — unstyled accessible components from Tailwind Labs
- **shadcn/ui** — owned UI components (uses Base UI + Radix depending on component)
- **Motion** — React animations (`motion` package, formerly Framer Motion)
- **Magic UI + Aceternity UI** — animated components via shadcn registry
- **Space Grotesk** (display) + **Inter** (body) + **Space Mono** (numbers/addresses)
- **viem + wagmi** — Web3 + ENS resolution
- **@worldcoin/idkit** — World ID 4.0 ZK proof verification
- **@privy-io/react-auth** — embedded wallet onboarding
- **Chainlink CRE** — automated winner selection + prize distribution

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

## UI & Animation

Installed via shadcn registry (copy into repo — no npm bloat for individual components):

| Source | Install more |
|---|---|
| shadcn/ui | `npx shadcn@latest add dialog tabs -y` |
| Magic UI | `npx shadcn@latest add @magicui/marquee -y` |
| Aceternity UI | `npx shadcn@latest add @aceternity/3d-card -y` |

**Starter components:** `blur-fade`, `number-ticker`, `text-generate-effect` in `components/ui/`.

**Motion core:** `npm install motion` — import from `@/lib/motion` or `motion/react`.

> WLD5050 design rule: no gradients, no shadows. Prefer subtle motion (`blur-fade`, `number-ticker`) over spotlight/3D effects.

## Foundation / Primitives

| Package | Status | Notes |
|---|---|---|
| `tailwindcss` v4 | ✅ installed | PostCSS via `@tailwindcss/postcss`, config in `app/globals.css` |
| `@radix-ui/react-*` | ✅ installed | Dialog, Select, Tabs, Tooltip, Popover, Checkbox, Switch, Avatar, ScrollArea, Slot |
| `@headlessui/react` | ✅ installed | Use for custom unstyled menus, modals, disclosures |

Add more Radix primitives as needed:
```bash
npm install @radix-ui/react-accordion @radix-ui/react-navigation-menu
```

Add Radix-based shadcn components (will use installed primitives):
```bash
npx shadcn@latest add dialog dropdown-menu tabs tooltip -y
```

## Utility / DX

| Package | Status | Usage |
|---|---|---|
| `zod` | ✅ installed | Runtime validation — see `lib/env.schema.ts` |
| `clsx` + `tailwind-merge` | ✅ installed | Conditional classes via `cn()` in `lib/utils.ts` |

```tsx
import { cn } from '@/lib/utils'
import { parsePublicEnv } from '@/lib/env.schema'

<div className={cn('border', isLive && 'border-green-600')} />
```

## Typography & Fonts

Self-hosted via `@fontsource/*` (no Google Fonts CDN — zero layout shift):

| Font | Package | Role |
|---|---|---|
| Inter | `@fontsource/inter` | Body text |
| Space Grotesk | `@fontsource/space-grotesk` | Display / headings |
| Space Mono | `@fontsource/space-mono` | Addresses, numbers |

Imported in `lib/fonts.ts` → loaded from `app/layout.tsx`.

**Balanced headlines:** `react-wrap-balancer` via `<BalancedText>` in `components/ui/balanced-text.tsx`.

## Icons

| Library | Status | When to use |
|---|---|---|
| `lucide-react` | ✅ default | shadcn/ui, nav, buttons — clean & MIT |
| `react-icons` | ✅ installed | Font Awesome, Heroicons, Bootstrap, etc. |
| `@hugeicons/react` | ✅ installed | Premium SaaS look (+ `@hugeicons/core-free-icons`, 5,100+ free) |

> `hugeicons-react` on npm is **deprecated** — this project uses `@hugeicons/react` instead.

```tsx
// Lucide (default — use for most UI)
import { Ticket, ShieldCheck } from 'lucide-react'
<Ticket className="size-4" />

// react-icons (kitchen sink)
import { FaEthereum } from 'react-icons/fa6'
<FaEthereum className="size-4" />

// Hugeicons (free stroke set)
import { HugeiconsIcon } from '@hugeicons/react'
import { Ticket01Icon } from '@hugeicons/core-free-icons'
<HugeiconsIcon icon={Ticket01Icon} size={16} color="currentColor" />
```

Consistent sizing: `lib/icon-size.ts` (`xs` 12 → `lg` 20).

## Scroll & Advanced Animation

| Package | Status | Role |
|---|---|---|
| `gsap` | ✅ installed | ScrollTrigger + timeline animations (`lib/gsap.ts`) |
| `lenis` | ✅ installed | Smooth scroll — active site-wide via `MotionProviders` |
| `@react-spring/web` | ✅ installed | Spring physics (`lib/spring.ts`) |

Lenis + GSAP ScrollTrigger are synced in `components/providers/motion-providers.tsx`. Respects `prefers-reduced-motion`.

```tsx
// GSAP scroll animation
'use client'
import { useGsapScrollTrigger, gsap } from '@/hooks/use-gsap-scroll-trigger'

const ref = useGsapScrollTrigger((el) => {
  gsap.from(el, { opacity: 0, y: 24, scrollTrigger: { trigger: el, start: 'top 85%' } })
}, [])

// React Spring
'use client'
import { animated, useSpring } from '@/lib/spring'
```

## 3D & Immersive

| Package | Role |
|---|---|
| `three` | WebGL 3D engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | OrbitControls, Environment, loaders |

```tsx
import { SceneCanvas } from '@/components/three'
import { WireframeOrb } from '@/components/three/wireframe-orb'

<SceneCanvas className="h-[360px] w-full">
  <WireframeOrb />
</SceneCanvas>
```

Client utilities: `lib/three.ts`. Canvas uses dynamic import (`ssr: false`).

## Visual Polish & Effects

| Package | shadcn component | Role |
|---|---|---|
| `vaul` | `components/ui/drawer.tsx` | Mobile bottom sheet / drawer |
| `cmdk` | `components/ui/command.tsx` | ⌘K command palette |
| `sonner` | `components/ui/sonner.tsx` | Toasts (primary — wired in layout) |
| `react-hot-toast` | `lib/hot-toast.ts` | Lean toast alternative |

**Toasts (Sonner — default):**
```tsx
import { toast, toastSuccess } from '@/lib/toast'
toast('Ticket purchased')
toastSuccess('World ID verified')
```

**Command palette:** `⌘K` / `Ctrl+K` — `components/layout/command-menu.tsx`

**Drawer:**
```tsx
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
```

## Layout Utilities

| Package | Status | Notes |
|---|---|---|
| `usehooks-ts` | ✅ installed | Re-exports in `hooks/use-layout.ts` |
| `postcss` + `autoprefixer` | ✅ installed | `postcss.config.mjs` — runs after Tailwind v4 |

```tsx
'use client'
import { useMediaQuery, useLocalStorage, useWindowSize } from '@/hooks/use-layout'
import { useIsMobile } from '@/hooks/use-is-mobile'

const isMobile = useIsMobile() // drawer on mobile, dialog on desktop
const { width } = useWindowSize()
const [theme, setTheme] = useLocalStorage('wld5050-prefs', { compact: false })
```

## Shader, Text FX & Atmosphere (WOW layer)

| Package | Wrapper | Role |
|---|---|---|
| `@paper-design/shaders-react` | `ShaderBackground` | MeshGradient hero backgrounds |
| `ogl` | `lib/ogl.ts` | Custom WebGL / GLSL |
| `split-type` | `hooks/use-split-text.ts` | Character-level GSAP headlines |
| `@react-bits/BlurText-TS-TW` | `components/BlurText.tsx` | Blur-to-sharp text reveal |
| `@tsparticles/react` + `slim` | `ParticlesBackground` | Snow / dot atmosphere |
| `react-fast-marquee` | `StatsMarquee` | Live stats / chains ticker |

```tsx
import { ShaderBackground, StatsMarquee, BlurText } from '@/components/effects'

<section className="relative overflow-hidden">
  <ShaderBackground />
  <BlurText text="Fair raffles." className="font-display text-4xl" />
</section>

<StatsMarquee items={['World Chain', '247 tickets', 'Chainlink CRE']} />
```

Add more React Bits: `npx shadcn@latest add @react-bits/GlitchText-TS-TW -y`

> Use sparingly — core design stays minimal; effects are optional hero accents.

## Advanced Animation & Micro-interactions

| Package | Wrapper | Role |
|---|---|---|
| `@theatre/core` | `lib/theatre.ts` | Cinematic scroll / DOM timelines |
| `@theatre/r3f` | `lib/theatre-r3f.ts` | 3D keyframe camera control (R3F v9 via legacy peer deps) |
| `matter-js` | `PhysicsBallPit` | 2D physics ball pit hero |
| `cursor-effects` | `CursorEffect` provider | Trailing dot / fairy dust cursor (opt-in) |
| `@formkit/drag-and-drop` | `hooks/use-sortable-list.ts` | Smooth sortable lists |

```tsx
// Sortable raffle list
'use client'
import { useSortableList } from '@/hooks/use-sortable-list'

const [ref, items] = useSortableList(['Round 41', 'Round 42'])

// Opt-in green dot cursor (not in layout by default)
import CursorEffect from '@/components/providers/cursor-effect'
<CursorEffect variant="dot" />

// Matter.js ball pit
import { PhysicsBallPit } from '@/components/effects'
<PhysicsBallPit ballCount={16} />
```

> `@theatre/r3f` officially targets R3F v8; this repo uses `--legacy-peer-deps` (see `.npmrc`) with R3F v9.

## Image & Media

| Package | Component | Role |
|---|---|---|
| `react-medium-image-zoom` | `ZoomImage` | Medium-style click-to-zoom |
| `swiper` | `MediaCarousel` | Carousels / raffle galleries |

```tsx
import { ZoomImage, MediaCarousel } from '@/components/media'

<ZoomImage src="/proof.jpg" alt="Settlement proof" className="w-full h-48" />

<MediaCarousel
  effect="fade"
  items={[
    { id: '1', content: <RaffleCard raffle={r1} /> },
    { id: '2', content: <RaffleCard raffle={r2} /> },
  ]}
/>
```

Custom Swiper effects: `import { EffectCoverflow, Autoplay } from '@/lib/swiper'`
