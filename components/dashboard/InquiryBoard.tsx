"use client";

import { NicheConfig } from "@/config/schema";
import { useInquiries, updateInquiryStatus } from "@/lib/demo-store";
import { formatCurrency } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function InquiryBoard({ config }: { config: NicheConfig }) {
  const inquiries = useInquiries(config.slug);
  const statuses = config.dashboard.statuses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Operator Dashboard</h1>
          <p className="text-slate-600 mt-1">{config.dashboard.intro}</p>
        </div>
        <div className="text-sm font-medium bg-white px-3 py-1.5 rounded-full border shadow-sm text-slate-500">
          Demo Mode: Changes are saved to your browser
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {statuses.map((status) => {
          const columnItems = inquiries.filter((i) => i.status === status);
          
          return (
            <div key={status} className="bg-slate-100/50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="font-bold text-slate-700 capitalize">
                  {config.dashboard.metricLabels[status] || status}
                </h2>
                <span className="bg-white text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full border">
                  {columnItems.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-900">{item.clientName}</p>
                        <p className="text-xs text-slate-500">{item.origin}</p>
                      </div>
                      <span className="font-bold text-primary">
                        {formatCurrency(item.estimatedTotal, item.currency)}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block mb-3">
                      {item.serviceName}
                    </p>
                    
                    {item.source === "local" && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                        New Submission
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs">
                      <span className="text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      
                      {/* Status Actions */}
                      <select 
                        value={item.status}
                        onChange={(e) => updateInquiryStatus(config.slug, item.id, e.target.value as any)}
                        className="bg-transparent font-medium text-slate-600 outline-none cursor-pointer hover:text-slate-900"
                      >
                        {statuses.map(s => <option key={s} value={s}>Move to {s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                
                {columnItems.length === 0 && (
                  <div className="text-center py-8 text-sm text-slate-400 border-2 border-dashed rounded-lg">
                    No inquiries here yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}