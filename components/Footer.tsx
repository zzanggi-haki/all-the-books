export function Footer() {
  return (
    <footer className="bg-footer-cream">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-2 text-center">
        {/* Line 1 — 브랜드 : 한 줄 소개 */}
        <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
          <span className="text-[15px] font-semibold text-ink inline-flex items-center gap-1.5">
            <span aria-hidden="true">📚</span>
            AllTheBooks
          </span>
          <span className="text-stone">:</span>
          <span className="text-[13px] text-charcoal">
            좋아하는 책을 좋은 가격에 사고 싶어서 만들었어요.
            <span className="text-stone"> (for </span>
            <span aria-label="개구리와 주황 하트">🐸🧡</span>
            <span className="text-stone">)</span>
          </span>
        </div>

        {/* Line 2 — 데이터 출처 + 제휴 디스클로저 */}
        <p className="text-[12px] text-steel">
          데이터 제공 ·{" "}
          <span className="text-ink font-medium">알라딘 OpenAPI</span>
          <span className="text-stone"> · 제휴 링크 포함</span>
        </p>

        {/* Line 3 — 제작자 + 카피라이트 + 빌드 */}
        <p className="text-[12px] text-steel">
          Made by <span className="text-ink font-medium">zzanggi</span>
          <span className="text-stone"> · </span>
          <a
            href="https://github.com/zzanggi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <span className="text-stone"> · </span>
          <a
            href="mailto:zzanggi91@gmail.com"
            className="text-ink hover:text-primary transition-colors"
          >
            문의
          </a>
          <span className="text-stone"> · © 2026 · v1.0 · Built with </span>
          <span className="text-charcoal font-medium">Claude Code</span>
          <span aria-hidden="true"> 🧡</span>
        </p>
      </div>
    </footer>
  );
}
