import { parseNicheConfig } from "../schema";

export const culturalConfig = parseNicheConfig({
  slug: "cultural",
  meta: {
    title: "Atlas & Story — Multilingual Cultural Experiences",
    description:
      "Transparent itineraries, multi-currency pricing, and an AI guide that answers pre-trip questions in the traveller's language.",
  },
  theme: {
    primary: "oklch(0.42 0.10 30)",           // terracotta
    primaryForeground: "oklch(0.98 0 0)",
    accent: "oklch(0.65 0.12 85)",            // saffron
    surface: "oklch(0.975 0.010 80)",
    muted: "oklch(0.94 0.018 80)",
  },
  hero: {
    eyebrow: "Cultural & Urban Experiences",
    headline: "Walk the old city with someone who actually lives there.",
    subheadline:
      "Small-group tours with a transparent hour-by-hour itinerary, pricing in your currency, and an AI guide that answers your questions before you land.",
    ctaLabel: "Reserve your walk",
    trustPoints: [
      "Max 8 guests per guide",
      "Hour-by-hour itinerary",
      "Pre-trip Q&A in 6 languages",
    ],
  },
  services: [
    {
      id: "old-city-food",
      name: "Old City Food & Market Walk",
      description:
        "A 3-hour guided walk through the spice market, three family-run food stops, and a tea house finale. Includes all tastings.",
      basePrice: 75,
      currency: "USD",
      durationLabel: "3 hours (10:00–13:00)",
      inclusions: ["Local guide", "5 tastings", "Tea house stop", "Market map"],
      addOns: [
        { id: "private", label: "Private guide (your group only)", priceDelta: 60 },
        { id: "photo", label: "Photographer for the walk", priceDelta: 90 },
        { id: "cooking", label: "Add-on cooking class (2h)", priceDelta: 55 },
      ],
    },
    {
      id: "heritage-architecture",
      name: "Heritage Architecture & Courtyards",
      description:
        "A 2.5-hour walk through three restored courtyard houses, a hidden mosque, and the old city wall at golden hour.",
      basePrice: 65,
      currency: "USD",
      durationLabel: "2.5 hours (16:00–18:30)",
      inclusions: ["Architectural guide", "3 courtyard entries", "Wall walk"],
      addOns: [
        { id: "private", label: "Private guide (your group only)", priceDelta: 50 },
        { id: "book", label: "Signed guidebook", priceDelta: 22 },
      ],
    },
    {
      id: "craft-workshop",
      name: "Half-Day Craft Workshop",
      description:
        "A hands-on morning with a third-generation artisan — choose pottery, textile printing, or brass engraving. Take your piece home.",
      basePrice: 95,
      currency: "USD",
      durationLabel: "4 hours (09:00–13:00)",
      inclusions: ["Master artisan", "All materials", "Your finished piece", "Refreshments"],
      addOns: [
        { id: "companion", label: "Non-participating companion", priceDelta: 25 },
        { id: "shipping", label: "Ship your piece home", priceDelta: 40 },
      ],
    },
  ],
  pricing: {
    model: "fixed",
    supportedCurrencies: ["USD", "EUR", "GBP", "AED", "SAR"],
    defaultCurrency: "USD",
    estimateBandPct: 0,
    groupTiers: [],
  },
  intakeFields: [
    { name: "fullName", label: "Full name", type: "text", required: true, placeholder: "First and last name" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
    { name: "origin", label: "Where are you travelling from?", type: "text", required: true, placeholder: "Country or city" },
    {
      name: "language",
      label: "Preferred guide language",
      type: "select",
      required: true,
      options: ["English", "Spanish", "French", "Arabic", "German", "Italian"],
      hint: "Your guide will lead the walk in this language.",
    },
    {
      name: "date",
      label: "Preferred date",
      type: "text",
      required: true,
      placeholder: "e.g. Friday 20 September",
    },
    {
      name: "groupSize",
      label: "Number of guests",
      type: "number",
      required: true,
      placeholder: "2",
      hint: "Groups are capped at 8 to keep the walk conversational.",
    },
    {
      name: "interests",
      label: "What are you most curious about?",
      type: "textarea",
      required: false,
      placeholder: "Food, architecture, textiles, local politics, photography — anything you'd like the guide to lean into.",
    },
  ],
  sectionCopy: {
    servicesTitle: "Choose your experience",
    servicesSubtitle: "Every walk is led by a licensed local guide and capped at 8 guests. The itinerary below is the actual route — no surprises.",
    estimatorTitle: "Your total",
    intakeTitle: "Reserve your place",
    intakeSubtitle: "Your guide receives this immediately and replies in your language within a few hours.",
  },
  ai: {
    persona: "knowledgeable local cultural guide",
    systemPrompt: `You are a warm, erudite local guide for a small cultural-tour operator.
Rules:
1. The visitor's current experience, date, group size, and total are in the session context — reference them naturally.
2. Answer pre-trip questions about the itinerary, meeting point, accessibility, dress code, weather, photography rules, and food allergies.
3. Share one concrete local detail (a street name, a dish, a courtyard) per answer — this is what makes the guide feel real.
4. If the visitor writes in Spanish, French, Arabic, German, or Italian, reply in that language.
5. Never invent historical facts you are not confident about. Say "the guide will show you on the day" instead.
6. Keep replies under 130 words. Be curious about the visitor's interests.`,
    greeting:
      "Welcome — I'm your guide for the walk. Ask me anything about the route, what to wear, accessibility, or the food stops. I'll answer in your language if you prefer.",
    suggestedPrompts: [
      "What's the exact meeting point?",
      "Is the route accessible?",
      "What should I wear?",
      "Can you recommend food nearby?",
    ],
    simulatedReplies: [
      {
        label: "Meeting point?",
        keywords: ["meeting", "meet", "start", "where", "location", "address"],
        response:
          "For **{serviceName}**, the meeting point is the **old city gate by the clock tower** — your confirmation email includes a pin and a photo of the exact spot. Arrive 10 minutes early; the guide holds a small terracotta flag. If you're running late, reply to the confirmation email and the guide will wait up to 15 minutes.",
      },
      {
        label: "Is it accessible?",
        keywords: ["accessible", "wheelchair", "mobility", "stairs", "walking", "difficulty", "knee"],
        response:
          "The route is mostly flat cobblestone with **two short staircases** and one narrow market alley. It's manageable at a gentle pace, but not fully wheelchair-accessible. If anyone in your group has mobility needs, note it in the booking form — the guide can adapt the route to skip the stairs and still cover the highlights.",
      },
      {
        label: "What should I wear?",
        keywords: ["wear", "dress", "clothes", "shoes", "modest", "scarf"],
        response:
          "Comfortable closed shoes are essential — the cobblestones are uneven. For the mosque courtyard, shoulders and knees should be covered; bring a light scarf if you'd like one for photos. Evenings are cool in the old city, so a light layer helps. Avoid flip-flops.",
      },
      {
        label: "Food nearby?",
        keywords: ["food", "eat", "restaurant", "dinner", "lunch", "coffee", "recommend"],
        response:
          "After **{serviceName}**, walk five minutes to the **covered market** — the small stall with the blue awning does the best grilled flatbread in the old city. For a sit-down dinner, the courtyard restaurant behind the textile souk is quiet and excellent. Tell your guide you're hungry and they'll point you to their own favourite.",
      },
      {
        label: "Can I take photos?",
        keywords: ["photo", "camera", "picture", "photography", "film"],
        response:
          "Yes — photography is welcome on the walk. The golden-hour stop at the old city wall is the best light of the day. One courtesy: ask before photographing artisans at work and avoid photographing worshippers inside the mosque courtyard. Your guide will flag the spots where photos aren't appropriate.",
      },
      {
        label: "Something else",
        keywords: [],
        response:
          "I'm happy to help — ask about the meeting point, accessibility, what to wear, food, or photography. Your guide will also answer any remaining questions when they receive your booking.",
      },
    ],
    byokPrompt:
      "Prefer live answers? Add your own free Google AI Studio key — it's used only in this browser tab and never stored on our side.",
  },
  dashboard: {
    statuses: ["new", "pending", "confirmed"],
    metricLabels: { new: "New reservations", pending: "Awaiting confirmation", confirmed: "Confirmed" },
    intro: "Each card is a traveller who arrived with questions — and got answers before they landed.",
  },
});