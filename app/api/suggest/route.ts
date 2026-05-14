import type { NextRequest } from "next/server";
import { cacheGet, cacheSet } from "@/lib/cache";
import { searchBooks } from "@/lib/providers/aladin";

export const dynamic = "force-dynamic";

const TTL_SUGGEST = 60 * 60; // 1시간
const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 5;

type Suggestion = {
  title: string;
  author: string;
  isbn13: string;
  cover: string;
};

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("q") ?? "";
  const q = raw.trim();

  if (q.length < MIN_QUERY_LENGTH) {
    return Response.json({ items: [] });
  }

  const normalized = q.toLowerCase().replace(/\s+/g, " ");
  const cacheKey = `suggest:v1:${normalized}`;

  const cached = await cacheGet<{ items: Suggestion[] }>(cacheKey);
  if (cached) return Response.json(cached);

  let items: Suggestion[] = [];
  try {
    const books = await searchBooks(q, MAX_RESULTS);
    items = books
      .filter((b) => b.isbn13)
      .map((b) => ({
        title: b.title,
        author: b.author,
        isbn13: b.isbn13,
        cover: b.cover,
      }));
  } catch (e) {
    console.error("[api/suggest] failed", e);
  }

  const payload = { items };
  await cacheSet(cacheKey, payload, TTL_SUGGEST);
  return Response.json(payload);
}
