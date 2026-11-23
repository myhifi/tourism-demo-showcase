"use client";

import { useState } from "react";
import { NicheConfig, Service, Inquiry } from "@/config/schema";
import { calculateTotal } from "@/lib/pricing";

interface Props {
  config: NicheConfig;
  service: Service;
  selectedAddOnIds: string[];
  groupSize: number;
  currency: string;
}

export function IntakeForm({ config, service, selectedAddOnIds, groupSize, currency }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate final numbers for the record
    const { minTotal } = calculateTotal(service, selectedAddOnIds, groupSize, config.pricing, currency);

    const newInquiry: Inquiry = {
      id: crypto.randomUUID(),
      niche: config.slug,
      clientName: formData["fullName"] || formData["name"] || "Anonymous",
      email: formData["email"] || "no-email@example.com",
      origin: formData["origin"] || "Unknown",
      serviceId: service.id,
      serviceName: service.name,
      estimatedTotal: minTotal,
      currency,
      groupSize,
      details: formData,
      status: "new",
      createdAt: new Date().toISOString(),
      source: "local",
    };

    // Read existing, merge, save to localStorage
    const existingRaw = localStorage.getItem(`demo:inquiries:${config.slug}`);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    localStorage.setItem(`demo:inquiries:${config.slug}`, JSON.stringify([newInquiry, ...existing]));

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-bold text-lg text-green-900 mb-2">Request Received</h3>
        <p className="text-sm text-green-800">
          Your intake has been saved. Switch to the <strong>Operator Dashboard</strong> in the top bar to see it appear immediately.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 mb-1">{config.sectionCopy.intakeTitle}</h3>
      <p className="text-sm text-slate-500 mb-5">{config.sectionCopy.intakeSubtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.intakeFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === "select" ? (
              <select
                required={field.required}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
              />
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            )}
            {field.hint && <p className="mt-1 text-xs text-slate-500">{field.hint}</p>}
          </div>
        ))}

        <button
          type="submit"
          className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Submit Intake
        </button>
      </form>
    </div>
  );
}