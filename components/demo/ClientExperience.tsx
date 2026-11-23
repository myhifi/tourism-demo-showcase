"use client";

import { useState } from "react";
import { NicheConfig } from "@/config/schema";
import { ServiceSelector } from "../booking/ServiceSelector";
import { PriceEstimator } from "../booking/PriceEstimator";
import { IntakeForm } from "../booking/IntakeForm";
import { ChatWidget } from "../chat/ChatWidget";

export function ClientExperience({ config }: { config: NicheConfig }) {
  // Central shared state
  const [selectedServiceId, setSelectedServiceId] = useState(config.services[0].id);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState(1);
  const [currency, setCurrency] = useState(config.pricing.defaultCurrency);

  const selectedService = config.services.find((s) => s.id === selectedServiceId)!;

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    setSelectedAddOnIds([]); // Reset add-ons when service changes
  };

  return (
    <div className="relative flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <section className="text-center pt-8 md:pt-16 max-w-3xl mx-auto">
        <p className="text-primary font-bold tracking-wide uppercase text-sm mb-3">
          {config.hero.eyebrow}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          {config.hero.headline}
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          {config.hero.subheadline}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 font-medium">
          {config.hero.trustPoints.map((point, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-primary">✓</span> {point}
            </span>
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Services */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{config.sectionCopy.servicesTitle}</h2>
            <p className="text-slate-600 mt-1">{config.sectionCopy.servicesSubtitle}</p>
          </div>
          <ServiceSelector
            services={config.services}
            selectedId={selectedServiceId}
            onSelect={handleServiceChange}
            currency={currency}
          />
        </div>

        {/* Right Column: Estimator & Form */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <PriceEstimator
            config={config}
            service={selectedService}
            selectedAddOnIds={selectedAddOnIds}
            toggleAddOn={toggleAddOn}
            groupSize={groupSize}
            setGroupSize={setGroupSize}
            currency={currency}
            setCurrency={setCurrency}
          />
          <IntakeForm
            config={config}
            service={selectedService}
            selectedAddOnIds={selectedAddOnIds}
            groupSize={groupSize}
            currency={currency}
          />
        </div>
      </div>

      <ChatWidget
        config={config}
        service={selectedService}
        selectedAddOnIds={selectedAddOnIds}
        groupSize={groupSize}
        currency={currency}
      />
    </div>
  );
}