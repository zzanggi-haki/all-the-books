export type Book = {
  itemId: number;
  isbn13: string;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  cover: string;
  priceStandard: number;
  priceSales: number;
  link: string;
  description?: string;
  categoryName?: string;
};

export type UsedOffer = {
  source: "aladin-online" | "aladin-store";
  storeName?: string;
  storeAddress?: string;
  price: number;
  quality?: string;
  link: string;
};

export type EbookOffer = {
  source: "aladin-ebook";
  price: number;
  link: string;
};

export type BookDetail = {
  book: Book;
  usedOffers: UsedOffer[];
  ebookOffers: EbookOffer[];
};

export type SearchResult = {
  query: string;
  primary: BookDetail | null;
  alternatives: Book[];
};
