import type { NicheConfig, NicheSlug } from "./schema";
import { medicalConfig } from "./niches/medical";
import { dayTripsConfig } from "./niches/day-trips";
import { culturalConfig } from "./niches/cultural";

const registry = {
  medical: medicalConfig,
  "day-trips": dayTripsConfig,
  cultural: culturalConfig,
} satisfies Record<NicheSlug, NicheConfig>;

export function getNicheConfig(slug: string): NicheConfig | null {
  if (slug in registry) return registry[slug as NicheSlug];
  return null;
}

export const nicheSlugs = Object.keys(registry) as NicheSlug[];

/** Human labels for the top switcher. */
export const nicheLabels: Record<NicheSlug, string> = {
  medical: "Medical Tourism",
  "day-trips": "Day-Trips",
  cultural: "Cultural Tours",
};

export { medicalConfig, dayTripsConfig, culturalConfig };
export type { NicheSlug } from "./schema";