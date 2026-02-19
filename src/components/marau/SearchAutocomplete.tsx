import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Loader2, Newspaper, Briefcase,
    MapPin, Calendar, ShoppingBag, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SearchSuggestion = {
    item_type: "news" | "jobs" | "points" | "events" | "classifieds";
    item_id: string;
    title: string;
    excerpt: string | null;
    route: string;
    published_at: string;
    rank: number;
};

const categoryIcon: Record<string, React.ReactNode> = {
    news: <Newspaper className="h-4 w-4 shrink-0 text-blue-500" />,
    jobs: <Briefcase className="h-4 w-4 shrink-0 text-green-500" />,
    points: <MapPin className="h-4 w-4 shrink-0 text-orange-500" />,
    events: <Calendar className="h-4 w-4 shrink-0 text-purple-500" />,
    classifieds: <ShoppingBag className="h-4 w-4 shrink-0 text-pink-500" />,
};

const categoryLabel: Record<string, string> = {
    news: "Notícia",
    jobs: "Vaga",
    points: "Local",
    events: "Evento",
    classifieds: "Classificado",
};

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

export function SearchAutocomplete() {
    const navigate = useNavigate();
    const [q, setQ] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const debouncedQ = useDebounce(q.trim(), 400);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // ── Busca principal via Supabase RPC ───────────────────────────────────────
    React.useEffect(() => {
        if (debouncedQ.length < 2) {
            setSuggestions([]);
            setOpen(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        (supabase as any)
            .rpc("search_portal", {
                q: debouncedQ,
                category: "all",
                sort: "relevance",
                page_size: 8,
                page_offset: 0,
            })
            .then(({ data, error }: { data: SearchSuggestion[] | null; error: any }) => {
                if (cancelled) return;
                setLoading(false);

                if (!error && data) {
                    setSuggestions(data);
                    setOpen(data.length > 0);
                    setActiveIndex(-1);
                } else {
                    setSuggestions([]);
                    setOpen(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setLoading(false);
                    setSuggestions([]);
                    setOpen(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [debouncedQ]);

    // Fecha ao clicar fora
    React.useEffect(() => {
        function handler(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    function goToResult(route: string) {
        setOpen(false);
        setQ("");
        navigate(route);
    }

    function submitSearch() {
        const trimmed = q.trim();
        if (!trimmed) return;
        setOpen(false);
        navigate(`/busca?q=${encodeURIComponent(trimmed)}`);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open) {
            if (e.key === "Enter") submitSearch();
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                goToResult(suggestions[activeIndex].route);
            } else {
                submitSearch();
            }
        } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
        }
    }

    function clearSearch() {
        setQ("");
        setSuggestions([]);
        setOpen(false);
        inputRef.current?.focus();
    }

    return (
        <div ref={containerRef} className="relative w-full sm:w-80 md:w-96 lg:w-[450px]">
            {/* ── Input ── */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="search"
                    placeholder="Buscar notícias, vagas, serviços..."
                    className="w-full h-11 rounded-full pl-5 pr-20 bg-muted border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (suggestions.length > 0 && q.trim().length >= 2) setOpen(true);
                    }}
                    autoComplete="off"
                    aria-label="Campo de busca"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
                />

                {q.length > 0 && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                        aria-label="Limpar busca"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={submitSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary p-1.5 transition-colors"
                    aria-label="Buscar"
                >
                    {loading
                        ? <Loader2 className="h-5 w-5 animate-spin" />
                        : <Search className="h-5 w-5" />}
                </button>
            </div>

            {/* ── Dropdown ── */}
            {open && suggestions.length > 0 && (
                <div
                    role="listbox"
                    aria-label="Sugestões de busca"
                    className="absolute top-full mt-2 left-0 right-0 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                >
                    <ul className="py-2 max-h-[420px] overflow-y-auto divide-y divide-border/40">
                        {suggestions.map((item, idx) => (
                            <li
                                key={`${item.item_type}-${item.item_id}`}
                                id={`suggestion-${idx}`}
                                role="option"
                                aria-selected={activeIndex === idx}
                                onMouseEnter={() => setActiveIndex(idx)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    goToResult(item.route);
                                }}
                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${activeIndex === idx ? "bg-primary/10" : "hover:bg-muted"
                                    }`}
                            >
                                <span className="mt-0.5">
                                    {categoryIcon[item.item_type] ?? categoryIcon["news"]}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`text-sm font-semibold leading-snug line-clamp-2 ${activeIndex === idx ? "text-primary" : ""
                                            }`}
                                    >
                                        {item.title}
                                    </p>
                                    {item.excerpt && (
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                            {item.excerpt}
                                        </p>
                                    )}
                                </div>

                                <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-0.5">
                                    {categoryLabel[item.item_type] ?? item.item_type}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Rodapé */}
                    <div className="border-t border-border px-4 py-2.5">
                        <button
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                submitSearch();
                            }}
                            className="w-full text-sm text-primary font-semibold hover:underline flex items-center justify-center gap-1.5 py-1"
                        >
                            <Search className="h-4 w-4" />
                            Ver todos os resultados para &ldquo;{q.trim()}&rdquo;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
