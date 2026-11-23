import { z } from "zod";

/* ──────────────────────────────────────────────────────────────
 * 1. Service / package definition
 * ────────────────────────────────────────────────────────────── */

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  /** Base price in the service's native currency (usually the config default). */
  basePrice: z.number().positive(),
  /** ISO 4217 — used when the visitor has not switched currency. */
  currency: z.string().length(3),
  /** Human-readable duration badge: "90 min", "Full day", "3–5 days". */
  durationLabel: z.string(),
  /** Optional inclusions shown as chips under the service card. */
  inclusions: z.array(z.string()).default([]),
  /** Add-ons the visitor can toggle in the price estimator. */
  addOns: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      /** Positive = surcharge, negative = discount. */
      priceDelta: z.number(),
    })
  ).default([]),
});

/* ──────────────────────────────────────────────────────────────
 * 2. Pricing model
 *    - "fixed"          : one price per booking (cultural tours)
 *    - "per-person"     : basePrice × travellers + add-ons (day trips)
 *    - "estimate-range" : show a ±band around basePrice (medical)
 * ────────────────────────────────────────────────────────────── */

export const PricingModelSchema = z.enum(["fixed", "per-person", "estimate-range"]);

export const PricingConfigSchema = z.object({
  model: PricingModelSchema,
  /** Currencies the visitor can toggle between (display-only, static rates). */
  supportedCurrencies: z.array(z.string().length(3)).min(1),
  defaultCurrency: z.string().length(3),
  /**
   * For "estimate-range": how far below/above basePrice to show.
   * 0.15 → basePrice * 0.85 to basePrice * 1.15. Ignored for other models.
   */
  estimateBandPct: z.number().min(0).max(0.5).default(0.15),
  /**
   * For "per-person": group-size tiers. Optional — if omitted, a flat
   * per-person multiplier is used. Each tier covers [min, max] travellers
   * and applies a multiplier to the base price per person.
   */
  groupTiers: z.array(
    z.object({
      min: z.number().int().positive(),
      max: z.number().int().positive(),
      /** e.g. 1.0 for 1–2 people, 0.9 for 3–5, 0.85 for 6+ */
      multiplier: z.number().positive(),
      label: z.string(),
    })
  ).default([]),
});

/* ──────────────────────────────────────────────────────────────
 * 3. Intake form fields — rendered dynamically, niche-specific
 * ────────────────────────────────────────────────────────────── */

export const IntakeFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(["text", "email", "tel", "number", "select", "textarea"]),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  /** Required when type === "select". */
  options: z.array(z.string()).optional(),
  /** Optional help text shown under the field. */
  hint: z.string().optional(),
});

/* ──────────────────────────────────────────────────────────────
 * 4. AI concierge configuration — dual-mode
 * ────────────────────────────────────────────────────────────── */

export const SimulatedReplySchema = z.object({
  /** Short label used as a quick-reply chip. */
  label: z.string(),
  /** Keywords that trigger this reply when the visitor types free text. */
  keywords: z.array(z.string()),
  /** The response text. May contain {serviceName}, {estimate}, {currency}. */
  response: z.string(),
});

export const AIConfigSchema = z.object({
  persona: z.string(),
  /** Full system prompt used only when a real key is available. */
  systemPrompt: z.string(),
  greeting: z.string(),
  /** Quick-reply chips shown on first open. */
  suggestedPrompts: z.array(z.string()).min(2).max(6),
  /**
   * Simulated replies — matched against the visitor's message (lowercased,
   * keyword substring match) and against suggested-prompt clicks.
   * Always include a catch-all whose keywords are empty.
   */
  simulatedReplies: z.array(SimulatedReplySchema).min(1),
  /**
   * Copy shown in the BYOK panel. Keep it reassuring and specific to the niche.
   */
  byokPrompt: z.string(),
});

/* ──────────────────────────────────────────────────────────────
 * 5. Dashboard configuration
 * ────────────────────────────────────────────────────────────── */

export const DashboardConfigSchema = z.object({
  statuses: z.array(z.enum(["new", "pending", "confirmed"])).length(3),
  metricLabels: z.record(z.string()),
  /** Short line shown above the Kanban board. */
  intro: z.string(),
});

/* ──────────────────────────────────────────────────────────────
 * 6. Full niche configuration
 * ────────────────────────────────────────────────────────────── */

export const NicheConfigSchema = z.object({
  slug: z.enum(["medical", "day-trips", "cultural"]),
  meta: z.object({
    title: z.string(),
    description: z.string(),
  }),
  theme: z.object({
    primary: z.string(),
    primaryForeground: z.string(),
    accent: z.string(),
    surface: z.string(),
    /** Optional muted surface for cards / panels. Defaults to surface. */
    muted: z.string().optional(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subheadline: z.string(),
    ctaLabel: z.string(),
    /** 2–3 proof points rendered under the CTA. */
    trustPoints: z.array(z.string()).min(1).max(4),
  }),
  services: z.array(ServiceSchema).min(1),
  pricing: PricingConfigSchema,
  intakeFields: z.array(IntakeFieldSchema).min(2),
  /** Section headings — lets you tune language per niche without new components. */
  sectionCopy: z.object({
    servicesTitle: z.string(),
    servicesSubtitle: z.string(),
    estimatorTitle: z.string(),
    intakeTitle: z.string(),
    intakeSubtitle: z.string(),
  }),
  ai: AIConfigSchema,
  dashboard: DashboardConfigSchema,
});

/* ──────────────────────────────────────────────────────────────
 * 7. Inferred types + inquiry record
 * ────────────────────────────────────────────────────────────── */

export type NicheConfig = z.infer<typeof NicheConfigSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type PricingConfig = z.infer<typeof PricingConfigSchema>;
export type IntakeField = z.infer<typeof IntakeFieldSchema>;
export type SimulatedReply = z.infer<typeof SimulatedReplySchema>;
export type NicheSlug = NicheConfig["slug"];

/**
 * The single record shape used by both seed data and localStorage.
 * `source` lets the dashboard badge demo submissions distinctly.
 */
export interface Inquiry {
  id: string;
  niche: NicheSlug;
  clientName: string;
  email: string;
  /** Free-text country or origin, shown on the card. */
  origin: string;
  serviceId: string;
  serviceName: string;
  estimatedTotal: number;
  currency: string;
  groupSize: number;
  /** Niche-specific form values, keyed by IntakeField.name. */
  details: Record<string, string>;
  status: "new" | "pending" | "confirmed";
  createdAt: string; // ISO 8601
  source: "seed" | "local";
}

/**
 * Validate a raw config object. Throws a readable error at import time
 * if any niche file drifts from the contract.
 */
export function parseNicheConfig(raw: unknown): NicheConfig {
  const result = NicheConfigSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid niche config:\n${issues}`);
  }
  return result.data;
}