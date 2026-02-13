import { CalendarDays } from "lucide-react";
import { useQuotes } from "@/hooks/useQuotes";
import { TickerItem } from "./types";

const defaultTickers: TickerItem[] = [
  { label: "USD", value: "R$ 5,01" },
  { label: "Bitcoin", value: "R$ 350k" },
  { label: "Soja", value: "R$ 135,00" },
  { label: "Milho", value: "R$ 55,20" },
];

const formatDate = (date: Date): string => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
};

export function TopBar() {
  const { quotes } = useQuotes();
  const today = new Date();
  const dateLabel = formatDate(today);
  const tickers = quotes?.quotes || defaultTickers;

  return (
    <div className="bg-primary text-primary-foreground py-2 shadow-sm relative z-50">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center text-xs md:text-sm text-primary-foreground/80 font-medium">
          <CalendarDays className="h-4 w-4 mr-2 text-secondary" aria-hidden="true" />
          {dateLabel}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto max-w-full no-scrollbar text-sm font-medium">
          <span className="text-primary-foreground/90 font-bold mr-1 hidden sm:inline">Cotações</span>
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
