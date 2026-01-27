import { CalendarDays } from "lucide-react";

import { TickerItem } from "./types";

const defaultTickers: TickerItem[] = [
  { label: "USD", value: "R$ 5,01" },
  { label: "Soja", value: "R$ 135,00" },
  { label: "Milho", value: "R$ 55,20" },
];

export function TopBar({ dateLabel = "Quarta-feira, 25 de Outubro", tickers = defaultTickers }: {
  dateLabel?: string;
  tickers?: TickerItem[];
}) {
  return (
    <div className="bg-primary text-primary-foreground py-2 shadow-sm relative z-50">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center text-xs md:text-sm text-primary-foreground/80 font-medium">
          <CalendarDays className="h-4 w-4 mr-2 text-secondary" aria-hidden="true" />
          {dateLabel}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto max-w-full no-scrollbar text-sm font-medium">
          {tickers.map((t) => (
            <span key={t.label} className="flex items-center gap-2 bg-background/10 px-3 py-1 rounded-full whitespace-nowrap">
              <span className="text-secondary font-bold">{t.label}</span>
              <span className="text-primary-foreground">{t.value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
