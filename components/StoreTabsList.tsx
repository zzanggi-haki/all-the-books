"use client";

import { useEffect, useMemo, useState } from "react";
import { OfferRow } from "@/components/OfferRow";
import { inferRegion, REGION_ORDER, type Region } from "@/lib/region";
import type { UsedOffer } from "@/lib/types";

const TAB_ALL = "전체" as const;
type TabValue = typeof TAB_ALL | Region;

const INITIAL_LIMIT = 10;

export function StoreTabsList({ offers }: { offers: UsedOffer[] }) {
  const grouped = useMemo(() => {
    const map = new Map<Region, UsedOffer[]>();
    for (const offer of offers) {
      const region = inferRegion(offer.storeName ?? "");
      const list = map.get(region) ?? [];
      list.push(offer);
      map.set(region, list);
    }
    return REGION_ORDER.filter((r) => map.has(r)).map((r) => ({
      region: r,
      offers: (map.get(r) ?? []).sort((a, b) =>
        (a.storeName ?? "").localeCompare(b.storeName ?? "", "ko"),
      ),
    }));
  }, [offers]);

  const showTabs = grouped.length >= 2;
  const [active, setActive] = useState<TabValue>(TAB_ALL);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [active]);

  const visibleOffers =
    active === TAB_ALL
      ? grouped.flatMap((g) => g.offers)
      : (grouped.find((g) => g.region === active)?.offers ?? []);

  const shouldLimit = visibleOffers.length > INITIAL_LIMIT;
  const displayedOffers =
    shouldLimit && !expanded
      ? visibleOffers.slice(0, INITIAL_LIMIT)
      : visibleOffers;
  const hiddenCount = visibleOffers.length - INITIAL_LIMIT;

  return (
    <div>
      {showTabs && (
        <div className="flex flex-wrap gap-1.5 mb-4 -mx-1 px-1 pb-1 overflow-x-auto">
          <TabChip
            label={TAB_ALL}
            count={offers.length}
            active={active === TAB_ALL}
            onClick={() => setActive(TAB_ALL)}
          />
          {grouped.map(({ region, offers: regionOffers }) => (
            <TabChip
              key={region}
              label={region}
              count={regionOffers.length}
              active={active === region}
              onClick={() => setActive(region)}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {displayedOffers.map((offer, i) => (
          <OfferRow
            key={`${offer.storeName}-${i}`}
            label={offer.storeName ?? "알라딘 중고서점"}
            price={null}
            href={offer.link}
            badge="매장"
          />
        ))}
      </div>

      {shouldLimit && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 w-full h-11 rounded-lg border border-hairline-strong bg-canvas text-[13px] font-medium text-ink hover:border-primary hover:text-primary transition-colors"
        >
          {expanded ? "접기 ↑" : `+ ${hiddenCount}개 더 보기`}
        </button>
      )}
    </div>
  );
}

function TabChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[13px] font-medium border transition-colors",
        active
          ? "bg-ink text-on-dark border-ink"
          : "bg-canvas text-charcoal border-hairline hover:border-primary hover:text-primary",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "tabular text-[11px] font-semibold",
          active ? "text-on-dark opacity-80" : "text-stone",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}
