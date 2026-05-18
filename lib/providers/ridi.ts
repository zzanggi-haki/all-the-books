const RIDI_SEARCH_BASE = "https://ridibooks.com/search";

// 리디는 ISBN 매칭률이 낮고 부제 포함 풀 타이틀도 0건 잡히는 케이스가 흔해서,
// 메인 타이틀만 추출해서 검색해야 매칭이 된다.
export function toRidiSearchQuery(title: string): string {
  let q = title.trim();
  // 앞쪽 [큰글자도서] 같은 대괄호 카테고리 prefix 제거
  q = q.replace(/^\[[^\]]*\]\s*/g, "");
  // 부제/판본 분리자 첫 출현 위치 앞부분만 사용
  const cutAt = Math.min(
    ...[" - ", " : ", " (", " ["]
      .map((sep) => q.indexOf(sep))
      .filter((i) => i > 0),
  );
  if (Number.isFinite(cutAt)) q = q.slice(0, cutAt);
  return q.trim();
}

export function buildRidiSearchUrl(title: string): string {
  const params = new URLSearchParams({
    q: toRidiSearchQuery(title),
    adult_exclude: "n",
  });
  return `${RIDI_SEARCH_BASE}?${params.toString()}`;
}
