import { parseNicheConfig } from "../schema";

export const medicalConfig = parseNicheConfig({
  slug: "medical",
  meta: {
    title: "Global Care — International Patient Concierge",
    description:
      "Streamlined intake and multilingual coordination for dental, cosmetic, and restorative procedures abroad.",
  },
  theme: {
    primary: "oklch(0.52 0.16 250)",        // deep clinical blue
    primaryForeground: "oklch(0.98 0 0)",
    accent: "oklch(0.72 0.10 190)",          // soft teal
    surface: "oklch(0.975 0.008 250)",
    muted: "oklch(0.94 0.012 250)",
  },
  hero: {
    eyebrow: "International Patient Intake",
    headline: "Your treatment journey, coordinated in one calm place.",
    subheadline:
      "Submit your case, receive a preliminary estimate, and speak with a multilingual care coordinator — no scattered WhatsApp threads, no repeated explanations.",
    ctaLabel: "Start my confidential intake",
    trustPoints: [
      "JCI-aligned partner clinics",
      "Coordinator replies in EN / ES / AR",
      "No obligation — estimate only",
    ],
  },
  services: [
    {
      id: "dental-implants",
      name: "Dental Implants — Single Tooth",
      description:
        "Consultation, 3D imaging, titanium implant placement, and one follow-up review. Crown sold separately if required.",
      basePrice: 1200,
      currency: "USD",
      durationLabel: "3–5 days on-site",
      inclusions: ["3D CBCT scan", "Implant + abutment", "Follow-up review"],
      addOns: [
        { id: "crown", label: "Porcelain crown", priceDelta: 450 },
        { id: "sedation", label: "IV sedation", priceDelta: 250 },
        { id: "translator", label: "Dedicated in-clinic translator", priceDelta: 120 },
      ],
    },
    {
      id: "veneers",
      name: "Porcelain Veneers — 6 Units",
      description:
        "Digital smile design, 6 hand-layered porcelain veneers, and two adjustment visits.",
      basePrice: 3600,
      currency: "USD",
      durationLabel: "5–7 days on-site",
      inclusions: ["Digital smile preview", "6 veneers", "2 adjustments"],
      addOns: [
        { id: "whitening", label: "In-chair whitening", priceDelta: 280 },
        { id: "nightguard", label: "Custom night guard", priceDelta: 180 },
      ],
    },
    {
      id: "rhinoplasty",
      name: "Rhinoplasty — Primary",
      description:
        "Surgeon consultation, pre-op labs, primary rhinoplasty, and 2 post-op reviews.",
      basePrice: 3400,
      currency: "USD",
      durationLabel: "7–10 days on-site",
      inclusions: ["Surgeon consult", "Pre-op labs", "2 post-op reviews"],
      addOns: [
        { id: "private-room", label: "Private recovery room (2 nights)", priceDelta: 600 },
        { id: "nurse", label: "Private post-op nurse (day 1)", priceDelta: 320 },
      ],
    },
  ],
  pricing: {
    model: "estimate-range",
    supportedCurrencies: ["USD", "EUR", "GBP"],
    defaultCurrency: "USD",
    estimateBandPct: 0.15,
    groupTiers: [],
  },
  intakeFields: [
    { name: "fullName", label: "Full name", type: "text", required: true, placeholder: "As shown on your passport" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
    { name: "origin", label: "Country of residence", type: "text", required: true, placeholder: "e.g. United Kingdom" },
    {
      name: "procedure",
      label: "Procedure of interest",
      type: "select",
      required: true,
      options: ["Dental Implants — Single Tooth", "Porcelain Veneers — 6 Units", "Rhinoplasty — Primary", "Not sure yet"],
    },
    {
      name: "travelWindow",
      label: "Preferred travel window",
      type: "text",
      required: false,
      placeholder: "e.g. March–April 2026",
      hint: "A rough month is enough — your coordinator will refine it.",
    },
    {
      name: "medicalNotes",
      label: "Relevant medical history or questions",
      type: "textarea",
      required: false,
      placeholder: "Allergies, current medication, prior procedures, or anything you'd like the coordinator to know.",
      hint: "This is encrypted in the demo — nothing is sent to a server.",
    },
  ],
  sectionCopy: {
    servicesTitle: "Choose your procedure",
    servicesSubtitle: "Estimates include the standard care pathway. Your coordinator confirms the final plan after review.",
    estimatorTitle: "Preliminary estimate",
    intakeTitle: "Confidential intake",
    intakeSubtitle: "Two minutes now saves days of back-and-forth later.",
  },
  ai: {
    persona: "multilingual medical coordinator",
    systemPrompt: `You are a calm, precise international patient coordinator for a medical tourism facilitator.
Rules:
1. NEVER diagnose, prescribe, or give clinical advice. If asked a clinical question, say a licensed partner surgeon will review it.
2. Collect: procedure interest, country of residence, preferred travel month, and any mobility or language needs.
3. Quote only the preliminary estimate you are given in the session context — never invent a price.
4. If the visitor writes in Spanish, Arabic, French, or Portuguese, reply in that language.
5. Escalate anything about complications, refunds, or visa emergencies to "a human coordinator" and offer the contact form.
6. Keep replies under 120 words unless the visitor asks for detail.`,
    greeting:
      "Hello — I'm your care coordinator. I can walk you through the estimate, travel logistics, and what happens after you submit an intake. What procedure are you considering?",
    suggestedPrompts: [
      "What's included in the implant estimate?",
      "How many days should I plan to stay?",
      "Can I speak with someone in Spanish?",
      "Is a deposit required to book?",
    ],
    simulatedReplies: [
      {
        label: "What's included?",
        keywords: ["include", "included", "what do i get", "cover", "package"],
        response:
          "The {serviceName} estimate of {estimate} covers the standard care pathway: consultation, imaging where relevant, the procedure itself, and follow-up reviews. Add-ons like a porcelain crown or IV sedation are listed separately so you can see exactly what changes the total. Your coordinator confirms the final inclusions after reviewing your intake.",
      },
      {
        label: "How long should I stay?",
        keywords: ["how long", "days", "stay", "trip length", "duration", "recovery"],
        response:
          "For {serviceName}, most patients plan **3–5 days on-site** for the procedure itself, plus a buffer for a follow-up review before flying home. Rhinoplasty and veneers typically need a slightly longer window (5–10 days). Your coordinator will give you a day-by-day plan once they see your travel dates.",
      },
      {
        label: "Can I speak Spanish?",
        keywords: ["spanish", "español", "language", "interpreter", "translator", "arabic", "french"],
        response:
          "Sí — we coordinate in English, Spanish, Arabic, and French. You can add a **dedicated in-clinic translator** to your estimate for $120, or simply tell your coordinator which language you prefer and they will match you with the right team member. Nothing about your care changes based on language.",
      },
      {
        label: "Is a deposit required?",
        keywords: ["deposit", "pay", "payment", "upfront", "book", "reserve"],
        response:
          "A small refundable deposit (typically 10–15% of the estimate) reserves your surgical slot. The remaining balance is settled directly with the clinic after your in-person consultation. Your coordinator will confirm the exact deposit for {serviceName} before anything is charged — this demo does not process payments.",
      },
      {
        label: "I'm not sure which procedure",
        keywords: [], // catch-all
        response:
          "That's completely normal. Tell me what you'd like to change or improve — for example, 'I have a missing molar' or 'I want a straighter smile' — and I'll point you to the closest option in the estimate. Your coordinator can also review photos securely if you're between two procedures.",
      },
    ],
    byokPrompt:
      "Want live, unrestricted answers? Paste a free Google AI Studio key below. It stays in this browser tab only — we never store or see it on our server.",
  },
  dashboard: {
    statuses: ["new", "pending", "confirmed"],
    metricLabels: { new: "New intakes", pending: "Awaiting review", confirmed: "Confirmed" },
    intro: "Every intake that lands here is a patient who no longer has to chase you across WhatsApp.",
  },
});