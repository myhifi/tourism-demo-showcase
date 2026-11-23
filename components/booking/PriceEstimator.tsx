"use client";

import { NicheConfig, Service } from "@/config/schema";
import { calculateTotal, formatCurrency } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface Props {
  config: NicheConfig;
  service: Service;
  selectedAddOnIds: string[];
  toggleAddOn: (id: string) => void;
  groupSize: number;
  setGroupSize: (size: number) => void;
  currency: string;
  setCurrency: (curr: string) => void;
}

export function PriceEstimator({
  config, service, selectedAddOnIds, toggleAddOn, groupSize, setGroupSize, currency, setCurrency
}: Props) {
  const { minTotal, maxTotal, isRange } = calculateTotal(
    service, selectedAddOnIds, groupSize, config.pricing, currency
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-slate-900">{config.sectionCopy.estimatorTitle}</h3>
        
        {/* Currency Switcher */}
        {config.pricing.supportedCurrencies.length > 1 && (
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1 text-sm font-medium text-slate-700 outline-none"
          >
            {config.pricing.supportedCurrencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      {/* Group Size (Per-Person model only) */}
      {config.pricing.model === "per-person" && (
        <div className="mb-6 pb-6 border-b border-slate-100">
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Number of Travellers
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
              className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50"
            >
              -
            </button>
            <span className="font-bold text-lg w-6 text-center">{groupSize}</span>
            <button
              onClick={() => setGroupSize(groupSize + 1)}
              className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Add-ons */}
      {service.addOns.length > 0 && (
        <div className="mb-6 pb-6 border-b border-slate-100 space-y-3">
          <label className="text-sm font-medium text-slate-700 block">Optional Add-ons</label>
          {service.addOns.map((addon) => (
            <label key={addon.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedAddOnIds.includes(addon.id)}
                  onChange={() => toggleAddOn(addon.id)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">{addon.label}</span>
              </div>
              <span className="text-sm font-medium text-slate-500">
                +{formatCurrency(addon.priceDelta, currency)}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Total Display */}
      <div className="flex items-end justify-between">
        <span className="text-slate-600 font-medium">Estimated Total</span>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-primary block leading-none">
            {isRange 
              ? `${formatCurrency(minTotal, currency)} – ${formatCurrency(maxTotal, currency)}`
              : formatCurrency(minTotal, currency)
            }
          </span>
          {isRange && (
            <span className="text-xs text-slate-500">preliminary estimate</span>
          )}
        </div>
      </div>
    </div>
  );
}