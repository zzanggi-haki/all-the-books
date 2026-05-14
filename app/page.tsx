import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <section
        className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 py-20 sm:py-28"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, var(--color-cream) 0%, var(--color-surface) 60%)",
        }}
      >
        <div className="w-full max-w-2xl">
          <h1 className="display text-[36px] sm:text-[64px] text-ink">
            한 권의 책,
            <br />
            가장 좋은 가격으로.
          </h1>

          <p className="mt-6 text-[17px] sm:text-[18px] text-slate leading-[1.55] max-w-xl">
            알라딘 중고서점 매장 재고부터 eBook 가격까지 — 어디서 사야 할지
            한 화면에서 비교하세요.
          </p>

          <div className="mt-10">
            <Suspense fallback={<div className="h-[64px]" />}>
              <SearchBar autoFocus size="hero" />
            </Suspense>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px] text-steel">
            <span className="text-stone">예:</span>
            <ExampleChip q="미움받을 용기" />
            <ExampleChip q="코스모스" />
            <ExampleChip q="사피엔스" />
            <ExampleChip q="달러구트 꿈 백화점" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ExampleChip({ q }: { q: string }) {
  return (
    <a
      href={`/search?q=${encodeURIComponent(q)}`}
      className="inline-flex items-center px-2.5 py-1 rounded-md bg-canvas border border-hairline-soft text-charcoal hover:border-primary hover:text-primary transition-colors"
    >
      {q}
    </a>
  );
}
