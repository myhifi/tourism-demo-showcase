import type { Service, PricingConfig } from "@/config/schema";

// Static mock exchange rates (Base: USD)
const FX_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75,
};

export function calculateTotal(
  service: Service,
  addOnIds: string[],
  groupSize: number,
  pricingConfig: PricingConfig,
  targetCurrency: string
) {
  // 1. Calculate Add-ons
  const addOnTotal = service.addOns
    .filter((a) => addOnIds.includes(a.id))
    .reduce((sum, a) => sum + a.priceDelta, 0);

  let baseTotal = service.basePrice;
  let isRange = false;

  // 2. Apply Pricing Model
  if (pricingConfig.model === "per-person") {
    // Find the tier multiplier
    const tier = pricingConfig.groupTiers.find(
      (t) => groupSize >= t.min && groupSize <= t.max
    );
    const multiplier = tier ? tier.multiplier : 1;
    
    // Base price * group size * multiplier + (addOns * group size for per-person? No, add-ons in configs are labeled "per group" or "per adult").
    // Assuming add-ons are flat unless explicitly stated. For simplicity in this demo, add-ons are flat.
    baseTotal = service.basePrice * groupSize * multiplier;
  } else if (pricingConfig.model === "estimate-range") {
    isRange = true;
  }

  // 3. Convert Currency
  const conversionRate = FX_RATES[targetCurrency] || 1;
  
  const convert = (val: number) => Math.round(val * conversionRate);

  const minTotal = convert(baseTotal + addOnTotal);
  const maxTotal = isRange
    ? convert((baseTotal + addOnTotal) * (1 + pricingConfig.estimateBandPct))
    : minTotal;

  return { minTotal, maxTotal, isRange };
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getEstimateString(
  service: Service,
  addOnIds: string[],
  groupSize: number,
  pricingConfig: PricingConfig,
  currency: string
) {
  const { minTotal, maxTotal, isRange } = calculateTotal(
    service,
    addOnIds,
    groupSize,
    pricingConfig,
    currency
  );

  if (isRange) {
    return `${formatCurrency(minTotal, currency)} – ${formatCurrency(maxTotal, currency)}`;
  }
  return formatCurrency(minTotal, currency);
}