import { Inquiry } from "@/config/schema";

export const seedInquiries: Record<string, Inquiry[]> = {
  medical: [
    {
      id: "seed-med-1", niche: "medical", clientName: "Sarah Jenkins", email: "sarah@example.com", origin: "United Kingdom",
      serviceId: "dental-implants", serviceName: "Dental Implants — Single Tooth", estimatedTotal: 1200, currency: "USD", groupSize: 1,
      details: { travelWindow: "March 2026" }, status: "new", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), source: "seed"
    },
    {
      id: "seed-med-2", niche: "medical", clientName: "Ahmed Al-Farsi", email: "ahmed@example.com", origin: "UAE",
      serviceId: "rhinoplasty", serviceName: "Rhinoplasty — Primary", estimatedTotal: 3400, currency: "USD", groupSize: 1,
      details: { travelWindow: "Next month" }, status: "pending", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), source: "seed"
    },
    {
      id: "seed-med-3", niche: "medical", clientName: "Elena Rossi", email: "elena@example.com", origin: "Italy",
      serviceId: "veneers", serviceName: "Porcelain Veneers — 6 Units", estimatedTotal: 3600, currency: "EUR", groupSize: 1,
      details: { travelWindow: "May 2026" }, status: "confirmed", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), source: "seed"
    },
  ],
  "day-trips": [
    {
      id: "seed-day-1", niche: "day-trips", clientName: "The Miller Family", email: "miller@example.com", origin: "Hotel Sol", 
      serviceId: "coast-snorkel", serviceName: "Coastline Snorkel & Beach Day", estimatedTotal: 340, currency: "USD", groupSize: 4,
      details: { date: "Saturday 14 June" }, status: "new", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), source: "seed"
    },
    {
      id: "seed-day-2", niche: "day-trips", clientName: "Liam & Chloe", email: "liam@example.com", origin: "Airbnb Marina", 
      serviceId: "sunset-sail", serviceName: "Sunset Sailing & Dolphin Watch", estimatedTotal: 130, currency: "USD", groupSize: 2,
      details: { date: "Tonight" }, status: "pending", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), source: "seed"
    }
  ],
  cultural: [
    {
      id: "seed-cul-1", niche: "cultural", clientName: "Yuki Tanaka", email: "yuki@example.com", origin: "Japan", 
      serviceId: "old-city-food", serviceName: "Old City Food & Market Walk", estimatedTotal: 75, currency: "USD", groupSize: 1,
      details: { language: "English", date: "Tomorrow" }, status: "new", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), source: "seed"
    },
    {
      id: "seed-cul-2", niche: "cultural", clientName: "Hans Müller", email: "hans@example.com", origin: "Germany", 
      serviceId: "heritage-architecture", serviceName: "Heritage Architecture & Courtyards", estimatedTotal: 65, currency: "EUR", groupSize: 2,
      details: { language: "German", date: "Friday 20 Sept" }, status: "confirmed", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), source: "seed"
    }
  ]
};