"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Suggestion = {
  title: string;
  author: string;
  isbn13: string;
  cover: string;
};

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;

export function SearchBar({
  initialQuery = "",
  autoFocus = false,
  size = "default",
}: {
  initialQuery?: string;
  autoFocus?: boolean;
  size?: "default" | "hero";
}) {
  const isHero = size === "hero";
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initialQuery || params.get("q") || "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    setQ(initialQuery || params.get("q") || "");
  }, [initialQuery, params]);

  // Debounced suggestion fetch
  useEffect(() => {
    const trimmed = q.trim();
    if (trimmed === lastQueryRef.current) return;
    lastQueryRef.current = trimmed;

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch(
          `/api/suggest?q=${encodeURIComponent(trimmed)}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) return;
        const data: { items: Suggestion[] } = await res.json();
        setSuggestions(data.items ?? []);
        setHighlighted(-1);
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error("[SearchBar] suggest failed", e);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [q]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (highlighted >= 0 && suggestions[highlighted]) {
      submit(suggestions[highlighted].isbn13);
    } else {
      submit(q);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(
        (i) => (i - 1 + suggestions.length) % suggestions.length,
      );
    }
  }

  const showDropdown =
    open && (suggestions.length > 0 || (loading && q.trim().length >= MIN_QUERY_LENGTH));

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={onSubmit} className="flex gap-2 w-full">
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="책 제목, 저자, ISBN"
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={
            highlighted >= 0 ? `suggestion-${highlighted}` : undefined
          }
          className={[
            "flex-1 rounded-lg bg-canvas text-ink placeholder:text-stone border border-hairline-strong focus:outline-none focus:border-primary focus:border-2 transition-shadow",
            isHero
              ? "h-14 sm:h-16 px-5 sm:px-6 focus:px-[19px] sm:focus:px-[23px] text-[17px] sm:text-[18px] shadow-sm focus:shadow-md"
              : "h-12 px-4 focus:px-[15px] text-[16px]",
          ].join(" ")}
        />
        <button
          type="submit"
          className={[
            "shrink-0 rounded-lg bg-primary text-on-primary font-medium tracking-[0.01em] hover:bg-primary-deep active:bg-primary-deep transition-colors",
            isHero
              ? "h-14 sm:h-16 px-6 sm:px-8 text-[15px] sm:text-[16px]"
              : "h-12 px-6 text-[14px]",
          ].join(" ")}
        >
          검색
        </button>
      </form>

      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-canvas border border-hairline rounded-lg overflow-hidden z-20"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.08) 0px 8px 24px -4px",
          }}
        >
          {suggestions.length === 0 && loading ? (
            <div className="px-4 py-3 text-[13px] text-steel">검색 중...</div>
          ) : (
            suggestions.map((s, i) => (
              <button
                key={s.isbn13 || `${s.title}-${i}`}
                id={`suggestion-${i}`}
                role="option"
                aria-selected={highlighted === i}
                type="button"
                onClick={() => submit(s.isbn13 || s.title)}
                onMouseEnter={() => setHighlighted(i)}
                className={[
                  "flex items-center gap-3 w-full px-3 py-2.5 text-left transition-colors",
                  highlighted === i
                    ? "bg-cream-soft"
                    : "bg-canvas hover:bg-cream-soft",
                  i > 0 ? "border-t border-hairline-soft" : "",
                ].join(" ")}
              >
                <div className="shrink-0 w-9 h-12 relative bg-cream-soft rounded overflow-hidden border border-hairline-soft">
                  {s.cover && (
                    <Image
                      src={s.cover}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium text-ink truncate">
                    {s.title}
                  </div>
                  {s.author && (
                    <div className="text-[12px] text-steel truncate mt-0.5">
                      {s.author}
                    </div>
                  )}
                </div>
                <span
                  aria-hidden="true"
                  className="text-stone text-[14px] shrink-0"
                >
                  ↵
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
