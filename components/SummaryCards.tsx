import type { BookDetail } from "@/lib/types";

export function SummaryCards({ detail }: { detail: BookDetail }) {
  const usedOnline = detail.usedOffers
    .filter((o) => o.source === "aladin-online" && o.price > 0)
    .sort((a, b) => a.price - b.price);
  const stores = detail.usedOffers.filter((o) => o.source === "aladin-store");
  const ebooks = [...detail.ebookOffers].sort((a, b) => a.price - b.price);

  const usedMinPrice = usedOnline[0]?.price ?? null;
  const ebookMinPrice = ebooks[0]?.price ?? null;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <SummaryCard
        anchor="#used-online"
        category="알라딘 중고"
        value={
          usedMinPrice != null
            ? `${usedMinPrice.toLocaleString()}원~`
            : null
        }
        sublabel={
          usedMinPrice != null ? `${usedOnline.length}개 매물` : undefined
        }
      />
      <SummaryCard
        anchor="#used-store"
        category="중고서점 매장"
        value={stores.length > 0 ? `${stores.length}곳` : null}
        sublabel={stores.length > 0 ? "재고 있음" : undefined}
      />
      <SummaryCard
        anchor="#ebook"
        category="전자책"
        value={
          ebookMinPrice != null
            ? `${ebookMinPrice.toLocaleString()}원~`
            : null
        }
        sublabel={ebookMinPrice != null ? `${ebooks.length}곳 제공` : undefined}
      />
    </div>
  );
}

function SummaryCard({
  anchor,
  category,
  value,
  sublabel,
}: {
  anchor: string;
  category: string;
  value: string | null;
  sublabel?: string;
}) {
  const base =
    "flex flex-col justify-between px-3 py-3.5 sm:px-4 sm:py-4 rounded-xl border bg-canvas transition-colors min-h-[104px] sm:min-h-[116px]";

  if (value == null) {
    return (
      <div
        className={`${base} border-hairline-soft cursor-default select-none`}
      >
        <div className="text-[13px] sm:text-[14px] font-medium text-stone">
          {category}
        </div>
        <div className="display text-[16px] sm:text-[18px] text-stone">
          아직 없어요
        </div>
        <div className="text-[11px] text-stone">&nbsp;</div>
      </div>
    );
  }

  return (
    <a
      href={anchor}
      className={`${base} border-hairline-soft hover:border-primary hover:bg-cream-soft group`}
    >
      <div className="text-[13px] sm:text-[14px] font-medium text-charcoal">
        {category}
      </div>
      <div className="display text-[20px] sm:text-[24px] md:text-[26px] text-primary tabular whitespace-nowrap">
        {value}
      </div>
      <div className="flex items-center justify-between">
        {sublabel ? (
          <span className="text-[11px] sm:text-[12px] text-steel">
            {sublabel}
          </span>
        ) : (
          <span />
        )}
        <span
          aria-hidden="true"
          className="text-[12px] text-stone group-hover:text-primary"
        >
          ↓
        </span>
      </div>
    </a>
  );
}
