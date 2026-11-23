import { notFound } from "next/navigation";
import { getNicheConfig, nicheSlugs } from "@/config";
import { DemoTopBar } from "@/components/demo/DemoTopBar";

import type { Metadata } from "next";

export function generateStaticParams() {
  return nicheSlugs.map((niche) => ({ niche }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ niche: string }> 
}): Promise<Metadata> {
  const { niche } = await params;
  const config = getNicheConfig(niche);
  
  if (!config) return { title: "Demo Not Found" };

  return {
    title: config.meta.title,
    description: config.meta.description,
    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
      type: "website",
    },
  };
}

export default function NicheLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { niche: string };
}) {
  const config = getNicheConfig(params.niche);
  if (!config) notFound();

  const themeStyles: React.CSSProperties & Record<`--${string}`, string> = {
    "--color-primary": config.theme.primary,
    "--color-primary-foreground": config.theme.primaryForeground,
    "--color-accent": config.theme.accent,
    "--color-surface": config.theme.surface,
    "--color-muted": config.theme.muted || config.theme.surface,
  };

  return (
    <div
      style={themeStyles}
      className="min-h-screen bg-surface pb-12 pt-24 text-slate-900"
    >
      <DemoTopBar currentNiche={config.slug} />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">{children}</main>
    </div>
  );
}
