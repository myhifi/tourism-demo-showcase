import { Service } from "@/config/schema";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/pricing";

interface Props {
  services: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
  currency: string;
}

export function ServiceSelector({ services, selectedId, onSelect, currency }: Props) {
  return (
    <div className="space-y-4">
      {services.map((service) => {
        const isActive = service.id === selectedId;
        return (
          <div
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={cn(
              "relative cursor-pointer rounded-xl border-2 p-5 transition-all",
              isActive
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-900">{service.name}</h3>
              <div className="text-right">
                <span className="font-bold text-lg text-primary">
                  {formatCurrency(service.basePrice, currency)}
                </span>
                <span className="text-xs text-slate-500 block">base</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">{service.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                ⏱ {service.durationLabel}
              </span>
              {service.inclusions.map((inc, i) => (
                <span key={i} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {inc}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}