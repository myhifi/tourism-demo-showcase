# 🌍 Tourism Niche Showcase (MVP)

A lightweight, modular Next.js template designed to validate B2B demand across three distinct tourism sectors. Instead of maintaining three separate codebases, this application uses a **single dynamic route** (`/demo/[niche]`) driven by a Zod-validated configuration layer.

It is designed to be sent to business owners so they can experience how a modern booking, intake, and AI concierge solution solves their daily operational bottlenecks (scattered WhatsApp inquiries, manual quoting, and multilingual communication) in under 30 seconds.

## 🚀 Live Demos

Experience the three tailored niches (all running from the same codebase):

1. **Medical & Dental Tourism** (International Patient Intake)
   👉 [View Medical Demo](https://tourism-demo-showcase.vercel.app/demo/medical)
2. **Day-Trips & Recreational Excursions** (Fast Booking & Group Organizer)
   👉 [View Day-Trips Demo](https://tourism-demo-showcase.vercel.app/demo/day-trips)
3. **Cultural & Urban Experiences** (Multilingual Interactive Tour)
   👉 [View Cultural Demo](https://tourism-demo-showcase.vercel.app/demo/cultural)

## ✨ Key Features

- **Dynamic Theme Injection:** Tailwind CSS variables are injected at the layout level based on the active niche config, instantly changing colors, typography, and copy.
- **Smart Pricing Estimator:** Supports three distinct pricing models (`fixed`, `per-person` with group tiers, and `estimate-range`) calculated entirely client-side.
- **Dual-Mode AI Concierge:** 
  - *Simulated Mode (Default):* Rich, pre-written responses with a natural typing effect. Costs $0 in API tokens and has zero message limits.
  - *BYOK (Bring Your Own Key):* Users can paste their own free Google Gemini API key into the widget. The key is stored in `sessionStorage` and passed via headers to the server-side API route, enabling live, unrestricted AI responses.
- **Zero-Cost Operator Dashboard:** A Kanban board that merges mock seed data with the user's `localStorage`. When a prospect submits the intake form, it instantly appears on the dashboard without requiring a database or server writes.

## 🏗️ Architecture

The magic of this project lies in the `config/` directory. The UI components are entirely "niche-agnostic" and read from the configuration layer.

```text
config/
├── schema.ts         # Zod validation schemas for all niche configs
├── index.ts          # Registry resolver
└── niches/
    ├── medical.ts    # Theme, copy, pricing, form fields, AI prompts
    ├── day-trips.ts
    └── cultural.ts
```

**Adding a new niche takes minutes:**
1. Create a new file in `config/niches/` (e.g., `cooking.ts`).
2. Copy the structure from an existing file and update the text/pricing.
3. Export it in `config/index.ts`.
No new components or routes are required.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **AI Integration:** Vercel AI SDK + `@ai-sdk/google` (Gemini 2.5 Flash)
- **Hosting:** Vercel (Hobby Plan)

## 💻 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/myhifi/tourism-demo-showcase.git
   cd tourism-demo-showcase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up environment variables:
   Copy `.env.example` to `.env.local`. You can leave `GEMINI_API_KEY` blank if you are only using the Simulated Mode.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.