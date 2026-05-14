import Image from "next/image";
import type { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex gap-5">
      {book.cover ? (
        <div className="shrink-0 w-28 h-40 sm:w-32 sm:h-44 relative bg-cream-soft rounded-md overflow-hidden border border-beige-deep">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="shrink-0 w-28 h-40 sm:w-32 sm:h-44 bg-cream-soft rounded-md border border-beige-deep" />
      )}
      <div className="min-w-0 flex-1">
        <h2 className="display text-[22px] sm:text-[26px] text-ink leading-[1.2]">
          {book.title}
        </h2>
        {book.author && (
          <p className="text-[14px] text-charcoal mt-2 leading-snug">
            {book.author}
          </p>
        )}
        {book.publisher && (
          <p className="text-[13px] text-steel mt-1">
            {book.publisher}
            {book.pubDate && ` · ${book.pubDate}`}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {book.priceStandard > 0 && (
            <span className="text-[12px] text-stone line-through tabular">
              정가 {book.priceStandard.toLocaleString()}원
            </span>
          )}
          {book.priceSales > 0 && (
            <span className="text-[15px] font-semibold text-ink tabular">
              새책 {book.priceSales.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
