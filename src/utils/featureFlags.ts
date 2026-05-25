// Feature flags driven by Vercel's auto-injected NEXT_PUBLIC_VERCEL_ENV.
// - production  → strict (disable experimental features)
// - preview     → enable everything (PRs and non-main branches)
// - undefined   → local development (enable everything)

export function isRaidSimulatorEnabled(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";
}
