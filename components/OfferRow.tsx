export function OfferRow({
  label,
  sublabel,
  price,
  href,
  badge,
}: {
  label: string;
  sublabel?: string;
  price?: number | null;
  href: string;
  badge?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-hairline-soft bg-canvas hover:border-primary hover:bg-cream-soft transition-colors"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-ink truncate">
            {label}
          </span>
          {badge && (
            <span className="shrink-0 text-[10px] font-semibold tracking-[0.04em] uppercase px-1.5 py-0.5 rounded-md bg-cream-deeper text-ink">
              {badge}
            </span>
          )}
        </div>
        {sublabel && (
          <div className="text-[12px] text-steel truncate mt-1">
            {sublabel}
          </div>
        )}
      </div>
      <div className="text-right shrink-0 flex items-center gap-2">
        {price != null && price > 0 ? (
          <div className="text-[15px] font-semibold text-ink tabular">
            {price.toLocaleString()}원
          </div>
        ) : (
          <div className="text-[12px] font-medium text-primary">재고 있음</div>
        )}
        <span
          aria-hidden="true"
          className="text-stone group-hover:text-primary text-[14px]"
        >
          →
        </span>
      </div>
    </a>
  );
}
