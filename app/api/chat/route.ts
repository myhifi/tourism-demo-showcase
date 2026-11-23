import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { z } from "zod";
import { getNicheConfig } from "@/config";
import { getEstimateString } from "@/lib/pricing";

export const maxDuration = 30;

const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(12_000),
      })
    )
    .min(1)
    .max(40),
  niche: z.string(),
  context: z
    .object({
      serviceId: z.string().optional(),
      addOnIds: z.array(z.string()).max(50).optional(),
      groupSize: z.number().int().min(1).max(100).optional(),
      currency: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON request body" }, { status: 400 });
  }

  const parsedBody = ChatRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return Response.json({ error: "Invalid chat request" }, { status: 400 });
  }

  const { messages, niche, context } = parsedBody.data;
  const config = getNicheConfig(niche);

  if (!config) {
    return Response.json({ error: "Invalid niche" }, { status: 400 });
  }

  const byokKey = req.headers.get("x-gemini-api-key")?.trim();
  const serverKey = process.env.GEMINI_API_KEY?.trim();
  const apiKey = byokKey || serverKey;

  if (!apiKey) {
    return Response.json({ error: "no_key" }, { status: 401 });
  }

  let priceContext = "";
  const service = context?.serviceId
    ? config.services.find((item) => item.id === context.serviceId)
    : undefined;

  if (service) {
    const groupSize = context?.groupSize ?? 1;
    const requestedCurrency = context?.currency;
    const currency =
      requestedCurrency &&
      config.pricing.supportedCurrencies.includes(requestedCurrency)
        ? requestedCurrency
        : config.pricing.defaultCurrency;
    const addOnIds = (context?.addOnIds ?? []).filter((id) =>
      service.addOns.some((addOn) => addOn.id === id)
    );
    const priceString = getEstimateString(
      service,
      addOnIds,
      groupSize,
      config.pricing,
      currency
    );

    priceContext = `\n\nCurrent session context:\nThe visitor is currently looking at: "${service.name}".\nGroup size: ${groupSize}.\nEstimated price: ${priceString}.\nReference this information naturally to answer their questions.`;
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey });
    const result = await streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      system: config.ai.systemPrompt + priceContext,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
