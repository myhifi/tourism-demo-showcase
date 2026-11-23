import { getNicheConfig } from "@/config";
import { notFound } from "next/navigation";
import { ClientExperience } from "@/components/demo/ClientExperience";

export default function NichePage({ params }: { params: { niche: string } }) {
  const config = getNicheConfig(params.niche);
  
  if (!config) {
    notFound();
  }

  return <ClientExperience config={config} />;
}