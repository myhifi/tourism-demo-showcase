import { getNicheConfig } from "@/config";
import { notFound } from "next/navigation";
import { InquiryBoard } from "@/components/dashboard/InquiryBoard";

export default function DashboardPage({ params }: { params: { niche: string } }) {
  const config = getNicheConfig(params.niche);
  
  if (!config) {
    notFound();
  }

  return <InquiryBoard config={config} />;
}