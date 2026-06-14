import { z } from 'zod'

/** Browser-safe env (NEXT_PUBLIC_*). All fields optional at dev time. */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_WLD_APP_ID: z.string().optional(),
  NEXT_PUBLIC_WLD_ACTION: z.string().default('enter-raffle'),
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().optional(),
  NEXT_PUBLIC_WLD5050_CONTRACT: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional()
    .or(z.literal('')),
  NEXT_PUBLIC_CHAIN_ID: z.coerce.number().int().positive().default(480),
})

/** Server-only secrets — never use NEXT_PUBLIC_ prefix. */
export const serverEnvSchema = z.object({
  ETH_MAINNET_RPC_URL: z.string().url().optional(),
  WORLD_CHAIN_RPC_URL: z.string().url().optional(),
  PRIVY_APP_SECRET: z.string().min(1).optional(),
  CHAINLINK_CRE_API_KEY: z.string().min(1).optional(),
  ENS_CLAIM_SIGNER_PRIVATE_KEY: z.string().min(1).optional(),
  OPERATOR_PRIVATE_KEY: z.string().min(1).optional(),
  WORLD_RP_ID: z.string().optional(),
  WORLD_RP_SIGNING_KEY: z.string().optional(),
})

export type PublicEnv = z.infer<typeof publicEnvSchema>
export type ServerEnv = z.infer<typeof serverEnvSchema>

export function parsePublicEnv(env: NodeJS.ProcessEnv = process.env): PublicEnv {
  return publicEnvSchema.parse(env)
}

export function parseServerEnv(env: NodeJS.ProcessEnv = process.env): ServerEnv {
  return serverEnvSchema.parse(env)
}
