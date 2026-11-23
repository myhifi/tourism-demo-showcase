import { parseNicheConfig } from "../schema";

export const dayTripsConfig = parseNicheConfig({
  slug: "day-trips",
  meta: {
    title: "Coastline Days — Instant Group Excursions",
    description:
      "Browse single-day trips, get an instant group price, and confirm your booking without a single back-and-forth message.",
  },
  theme: {
    primary: "oklch(0.55 0.17 45)",          // warm sunset orange
    primaryForeground: "oklch(0.99 0 0)",
    accent: "oklch(0.70 0.14 200)",           // sea blue
    surface: "oklch(0.98 0.008 60)",
    muted: "oklch(0.95 0.015 60)",
  },
  hero: {
    eyebrow: "Single-Day Excursions",
    headline: "Pick a trip. See the price. Book it before the kids get bored.",
    subheadline:
      "Transparent per-person pricing, instant group totals, and add-ons you can toggle in seconds — no quote requests, no waiting for a reply.",
    ctaLabel: "Build my day trip",
    trustPoints: [
      "Instant group pricing",
      "Free cancellation up to 24h",
      "Licensed local guides",
    ],
  },
  services: [
    {
      id: "coast-snorkel",
      name: "Coastline Snorkel & Beach Day",
      description:
        "Half-day guided snorkel at two reef sites, beach lounge, and a light lunch. Equipment included.",
      basePrice: 85,
      currency: "USD",
      durationLabel: "Full day (9:00–16:00)",
      inclusions: ["Snorkel gear", "2 reef stops", "Lunch + water", "Beach lounger"],
      addOns: [
        { id: "pickup", label: "Hotel pickup (per group)", priceDelta: 40 },
        { id: "gopro", label: "GoPro rental", priceDelta: 25 },
        { id: "private-guide", label: "Private guide upgrade", priceDelta: 90 },
      ],
    },
    {
      id: "wine-valley",
      name: "Wine Valley Small-Group Tour",
      description:
        "Three family-run wineries, cellar tour, and a shared tasting platter. Max 8 guests.",
      basePrice: 110,
      currency: "USD",
      durationLabel: "Full day (10:00–18:00)",
      inclusions: ["3 wineries", "Cellar tour", "Tasting platter", "Max 8 guests"],
      addOns: [
        { id: "pickup", label: "Hotel pickup (per group)", priceDelta: 50 },
        { id: "cheese", label: "Local cheese board", priceDelta: 30 },
        { id: "photo", label: "Photographer (30 min)", priceDelta: 120 },
      ],
    },
    {
      id: "sunset-sail",
      name: "Sunset Sailing & Dolphin Watch",
      description:
        "Two-hour catamaran sail with dolphin spotting, soft drinks, and sunset return.",
      basePrice: 65,
      currency: "USD",
      durationLabel: "2.5 hours (17:00–19:30)",
      inclusions: ["Catamaran sail", "Soft drinks", "Dolphin guide"],
      addOns: [
        { id: "champagne", label: "Champagne toast (per adult)", priceDelta: 18 },
        { id: "pickup", label: "Hotel pickup (per group)", priceDelta: 35 },
      ],
    },
  ],
  pricing: {
    model: "per-person",
    supportedCurrencies: ["USD", "EUR", "GBP"],
    defaultCurrency: "USD",
    estimateBandPct: 0,
    groupTiers: [
      { min: 1, max: 2, multiplier: 1.0, label: "1–2 travellers" },
      { min: 3, max: 5, multiplier: 0.92, label: "3–5 travellers" },
      { min: 6, max: 12, multiplier: 0.85, label: "6–12 travellers" },
    ],
  },
  intakeFields: [
    { name: "fullName", label: "Lead traveller name", type: "text", required: true, placeholder: "First and last name" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
    { name: "origin", label: "Where are you staying?", type: "text", required: true, placeholder: "Hotel or area name" },
    { name: "date", label: "Preferred date", type: "text", required: true, placeholder: "e.g. Saturday 14 June" },
    {
      name: "groupSize",
      label: "Number of travellers",
      type: "number",
      required: true,
      placeholder: "4",
      hint: "Children under 3 travel free on all boat trips.",
    },
    {
      name: "dietary",
      label: "Dietary requirements",
      type: "select",
      required: false,
      options: ["None", "Vegetarian", "Vegan", "Gluten-free", "Nut allergy", "Other"],
    },
    {
      name: "notes",
      label: "Anything else we should know?",
      type: "textarea",
      required: false,
      placeholder: "Pickup address, mobility needs, celebration, or a request for the guide.",
    },
  ],
  sectionCopy: {
    servicesTitle: "Choose your day",
    servicesSubtitle: "All trips include a licensed guide and the essentials listed. Add-ons are priced per group unless stated otherwise.",
    estimatorTitle: "Instant group total",
    intakeTitle: "Lock in your date",
    intakeSubtitle: "Takes 90 seconds. You'll get a confirmation and a pickup note by email.",
  },
  ai: {
    persona: "friendly day-trip planner",
    systemPrompt: `You are a fast, upbeat day-trip booking assistant for a small coastal excursion operator.
Rules:
1. The visitor's current trip, group size, and total are in the session context — reference them directly.
2. Answer logistics questions (pickup, what to bring, sea sickness, kids' ages, cancellation) confidently and briefly.
3. If asked to change the date, group size, or add-ons, tell them exactly which control to use on the page — you cannot change the booking yourself.
4. If the visitor writes in Spanish, French, German, or Italian, reply in that language.
5. Never invent availability. Say "the calendar on this page shows live slots" if unsure.
6. Keep replies under 90 words. Use bullet points for lists.`,
    greeting:
      "Hey! I'm your trip planner. Ask me about pickup, what to bring, or whether the trip suits your group — I'll keep it short.",
    suggestedPrompts: [
      "Is pickup included?",
      "What should we bring?",
      "Is this okay for young kids?",
      "What's the cancellation policy?",
    ],
    simulatedReplies: [
      {
        label: "Is pickup included?",
        keywords: ["pickup", "pick up", "hotel", "transport", "transfer", "get there"],
        response:
          "Hotel pickup is available as an add-on for **$40 per group** (not per person). Toggle it in the estimator and it's added to your total instantly. If your hotel is outside the main strip, drop the name in the notes field and the guide will confirm the exact meeting point.",
      },
      {
        label: "What should we bring?",
        keywords: ["bring", "pack", "wear", "towel", "sunscreen", "what do i need"],
        response:
          "For **{serviceName}**, bring: swimwear, a towel, reef-safe sunscreen, a hat, and a refillable water bottle. Snorkel gear and lunch are included. Leave valuables at the hotel — there's no secure storage on the boat.",
      },
      {
        label: "Is it okay for kids?",
        keywords: ["kids", "children", "child", "toddler", "family", "age", "baby"],
        response:
          "Yes — **{serviceName}** works well for families. Children under 3 travel free, and life jackets in child sizes are on every boat. The snorkel stops are in calm, shallow water, and the guide can shorten the swim for younger kids. Just note their ages in the booking form so the right-size gear is ready.",
      },
      {
        label: "Cancellation policy?",
        keywords: ["cancel", "refund", "weather", "rain", "reschedule"],
        response:
          "Free cancellation up to **24 hours** before departure — full refund, no questions. If the operator cancels for weather or sea conditions, you can rebook any date or take a full refund. Inside 24 hours, we can usually move you to another trip if space allows.",
      },
      {
        label: "Can we add a private guide?",
        keywords: ["private", "exclusive", "just us", "our group only"],
        response:
          "Yes — the **private guide upgrade** is an add-on on the estimator (priced per group, not per person). It means the guide stays with your group only and can adjust the pace. For groups of 6+, it's often the better value than adding individual extras.",
      },
      {
        label: "Anything else",
        keywords: [],
        response:
          "Happy to help — ask me about pickup, what to bring, kids, cancellation, or add-ons. If you're ready, the booking form below locks in your date in about 90 seconds.",
      },
    ],
    byokPrompt:
      "Want live answers about this trip? Drop in a free Google AI Studio key — it stays in this tab and is only used for your own messages.",
  },
  dashboard: {
    statuses: ["new", "pending", "confirmed"],
    metricLabels: { new: "New bookings", pending: "Awaiting deposit", confirmed: "Confirmed" },
    intro: "This is what your morning looks like when the calculator does the quoting for you.",
  },
});