# HowMuchBook

**이 책 얼마야?** — 한 권의 책 가격을 한 화면에서 비교하는 서비스.

🔗 [howmuchbook.vercel.app](https://howmuchbook.vercel.app)

## 무엇을 비교하나

- **알라딘 중고 · 온라인** — 회원 직접 판매 매물 가격
- **알라딘 중고 · 매장** — 전국 중고서점 매장별 재고/가격
- **알라딘 eBook** — 전자책 가격
- **리디북스** — 외부 검색 링크 (가격 비교 불가, 검색 결과 페이지로 이동)

예정: 예스24 중고샵.

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** (CSS-first 토큰 시스템)
- **Pretendard Variable** 폰트
- **알라딘 OpenAPI** (ItemSearch / ItemLookUp / ItemOffStoreList)
- **Upstash Redis** REST API (응답 캐싱)
- **Vercel** (hobby tier 자동 배포)

## 로컬 실행

```bash
pnpm install
# .env.local 파일을 만들고 환경변수 채우기
pnpm dev
```

필요한 환경변수:
- `ALADIN_TTB_KEY` — [알라딘 OpenAPI](https://blog.aladin.co.kr/openapi/) 발급
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — [Upstash](https://upstash.com) 무료 티어

## 데이터 제공

도서 정보 및 가격은 **알라딘 OpenAPI**를 통해 제공받습니다. 알라딘 링크는 제휴 링크가 포함될 수 있습니다.

## 라이선스

개인 프로젝트 — 코드는 참고용으로 공개되어 있습니다.

---

Made by [zzanggi](https://github.com/zzanggi-haki) · Built with [Claude Code](https://claude.com/claude-code) 🧡
