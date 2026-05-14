"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SearchBar } from "@/components/SearchBar";

export function SearchHeader({ initialQuery }: { initialQuery: string }) {
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel — sticky 상태 감지용 */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      <div
        className={[
          "sticky top-0 z-20 transition-colors duration-200",
          stuck
            ? "bg-surface/90 backdrop-blur-md border-b border-hairline-soft"
            : "bg-transparent",
        ].join(" ")}
      >
        <div
          className={[
            "max-w-2xl mx-auto w-full px-4 sm:px-6 transition-[padding] duration-200",
            stuck ? "py-2.5" : "pt-6 sm:pt-8 pb-3",
          ].join(" ")}
        >
          <div
            className={[
              "grid items-center gap-x-2",
              stuck ? "grid-cols-[auto_1fr]" : "grid-cols-1 gap-y-3",
            ].join(" ")}
          >
            <Link
              href="/"
              aria-label="처음으로"
              className={
                stuck
                  ? "inline-flex items-center justify-center w-10 h-12 rounded-lg text-steel hover:text-primary hover:bg-cream-soft text-[18px] transition-colors"
                  : "text-[13px] text-steel hover:text-primary transition-colors"
              }
            >
              {stuck ? "←" : "← 처음으로"}
            </Link>
            <SearchBar initialQuery={initialQuery} />
          </div>
        </div>
      </div>
    </>
  );
}
