import { cacheGet, cacheSet, TTL } from "@/lib/cache";
import { getOffStores, lookupBook, searchBooks } from "@/lib/providers/aladin";
import type { BookDetail, SearchResult, UsedOffer } from "@/lib/types";

function normalize(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function search(query: string): Promise<SearchResult> {
  const q = normalize(query);
  if (!q) return { query, primary: null, alternatives: [] };

  // ISBN13 shortcut — 13자리 숫자면 검색 단계 건너뛰고 바로 lookup
  if (/^[0-9]{13}$/.test(q)) {
    const detail = await lookupWithStoresCached(q);
    return {
      query,
      primary: detail,
      alternatives: [],
    };
  }

  const cacheKey = `search:v2:${q}`;
  const cached = await cacheGet<SearchResult>(cacheKey);
  if (cached) return cached;

  const books = await searchBooks(q, 5);
  if (books.length === 0) {
    const empty: SearchResult = { query, primary: null, alternatives: [] };
    await cacheSet(cacheKey, empty, TTL.SEARCH);
    return empty;
  }

  const top = books[0];
  const detail = top.isbn13
    ? await lookupWithStoresCached(top.isbn13)
    : null;

  const result: SearchResult = {
    query,
    primary: detail ?? { book: top, usedOffers: [], ebookOffers: [] },
    alternatives: books.slice(1),
  };

  await cacheSet(cacheKey, result, TTL.SEARCH);
  return result;
}

async function lookupWithStoresCached(
  isbn13: string,
): Promise<BookDetail | null> {
  const cacheKey = `lookup:v2:${isbn13}`;
  const cached = await cacheGet<BookDetail>(cacheKey);
  if (cached) return cached;

  const [detail, storeOffers] = await Promise.all([
    lookupBook(isbn13),
    getOffStoresCached(isbn13),
  ]);
  if (!detail) return null;

  const merged: BookDetail = {
    ...detail,
    usedOffers: [...detail.usedOffers, ...storeOffers],
  };
  await cacheSet(cacheKey, merged, TTL.LOOKUP);
  return merged;
}

async function getOffStoresCached(isbn13: string): Promise<UsedOffer[]> {
  const cacheKey = `offstore:v1:${isbn13}`;
  const cached = await cacheGet<UsedOffer[]>(cacheKey);
  if (cached) return cached;
  const offers = await getOffStores(isbn13);
  await cacheSet(cacheKey, offers, TTL.OFFSTORE);
  return offers;
}
