import type {
  Book,
  BookDetail,
  EbookOffer,
  UsedOffer,
} from "@/lib/types";

const BASE_URL = "https://www.aladin.co.kr/ttb/api";
const VERSION = "20131101";

type AladinRawItem = {
  itemId: number;
  isbn?: string;
  isbn13?: string;
  title: string;
  author?: string;
  publisher?: string;
  pubDate?: string;
  cover?: string;
  priceStandard?: number;
  priceSales?: number;
  link?: string;
  description?: string;
  categoryName?: string;
  mallType?: string;
  subInfo?: {
    usedList?: {
      aladinUsed?: { itemCount?: number; minPrice?: number; link?: string };
      userUsed?: { itemCount?: number; minPrice?: number; link?: string };
      spaceUsed?: { itemCount?: number; minPrice?: number; link?: string };
    };
    ebookList?: Array<{
      itemId?: number;
      isbn?: string;
      isbn13?: string;
      priceSales?: number;
      link?: string;
    }>;
    offStoreList?: Array<{
      offCode?: string;
      offName?: string;
      offAddr?: string;
      offTel?: string;
      offPlace?: string;
      link?: string;
    }>;
  };
};

type AladinResponse = {
  item?: AladinRawItem[];
  errorCode?: number;
  errorMessage?: string;
};

type AladinOffStoreEntry = {
  offCode?: string;
  offName?: string;
  link?: string;
};

type AladinOffStoreResponse = {
  itemOffStoreList?: AladinOffStoreEntry[];
  errorCode?: number;
  errorMessage?: string;
};

function ttbKey(): string {
  const key = process.env.ALADIN_TTB_KEY;
  if (!key) throw new Error("ALADIN_TTB_KEY is not set");
  return key;
}

async function aladinFetch<T extends { errorCode?: number; errorMessage?: string }>(
  endpoint: string,
  params: Record<string, string>,
): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("ttbkey", ttbKey());
  url.searchParams.set("output", "js");
  url.searchParams.set("Version", VERSION);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Aladin API ${endpoint} returned ${res.status}`);
  }
  const text = await res.text();
  let data: T;
  try {
    data = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^﻿/, "").replace(/[\x00-\x1F]+/g, " ");
    data = JSON.parse(cleaned);
  }
  if (data.errorCode) {
    throw new Error(`Aladin error ${data.errorCode}: ${data.errorMessage}`);
  }
  return data;
}

function toBook(raw: AladinRawItem): Book {
  return {
    itemId: raw.itemId,
    isbn13: raw.isbn13 || raw.isbn || "",
    title: raw.title,
    author: raw.author ?? "",
    publisher: raw.publisher ?? "",
    pubDate: raw.pubDate ?? "",
    cover: raw.cover ?? "",
    priceStandard: raw.priceStandard ?? 0,
    priceSales: raw.priceSales ?? 0,
    link: raw.link ?? "",
    description: raw.description,
    categoryName: raw.categoryName,
  };
}

export async function searchBooks(
  query: string,
  maxResults = 5,
): Promise<Book[]> {
  const data = await aladinFetch<AladinResponse>("ItemSearch.aspx", {
    Query: query,
    QueryType: "Keyword",
    MaxResults: String(maxResults),
    start: "1",
    SearchTarget: "Book",
    Sort: "Accuracy",
    Cover: "Big",
  });
  return (data.item ?? []).map(toBook);
}

export async function lookupBook(isbn13: string): Promise<BookDetail | null> {
  const data = await aladinFetch<AladinResponse>("ItemLookUp.aspx", {
    itemIdType: "ISBN13",
    ItemId: isbn13,
    Cover: "Big",
    OptResult: "usedList,ebookList,offStoreList",
  });
  const raw = data.item?.[0];
  if (!raw) return null;

  const book = toBook(raw);
  const usedOffers: UsedOffer[] = [];
  const ebookOffers: EbookOffer[] = [];

  const used = raw.subInfo?.usedList;
  if (used?.aladinUsed?.itemCount && used.aladinUsed.minPrice) {
    usedOffers.push({
      source: "aladin-online",
      price: used.aladinUsed.minPrice,
      link: used.aladinUsed.link || book.link,
      quality: "알라딘 중고 (직접배송)",
    });
  }
  if (used?.userUsed?.itemCount && used.userUsed.minPrice) {
    usedOffers.push({
      source: "aladin-online",
      price: used.userUsed.minPrice,
      link: used.userUsed.link || book.link,
      quality: "회원 직접 판매 중고",
    });
  }
  if (used?.spaceUsed?.itemCount && used.spaceUsed.minPrice) {
    usedOffers.push({
      source: "aladin-online",
      price: used.spaceUsed.minPrice,
      link: used.spaceUsed.link || book.link,
      quality: "광활한 우주 중고",
    });
  }

  for (const ebook of raw.subInfo?.ebookList ?? []) {
    if (ebook.priceSales && ebook.link) {
      ebookOffers.push({
        source: "aladin-ebook",
        price: ebook.priceSales,
        link: ebook.link,
      });
    }
  }

  return { book, usedOffers, ebookOffers };
}

export async function getOffStores(isbn13: string): Promise<UsedOffer[]> {
  if (!isbn13) return [];
  try {
    const data = await aladinFetch<AladinOffStoreResponse>(
      "ItemOffStoreList.aspx",
      { ItemId: isbn13, ItemIdType: "ISBN13" },
    );
    return (data.itemOffStoreList ?? [])
      .filter((s) => s.offName && s.link)
      .map((store) => ({
        source: "aladin-store" as const,
        storeName: store.offName,
        price: 0,
        link: (store.link ?? "").replace(/&amp;/g, "&"),
      }));
  } catch (e) {
    console.error("[getOffStores] failed", e);
    return [];
  }
}
