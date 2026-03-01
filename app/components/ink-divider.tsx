export function InkDivider({ char }: { char: string }) {
  return (
    <div className="px-6">
      <div className="mx-auto max-w-2xl">
        <div className="ink-divider">
          <svg
            viewBox="0 0 800 24"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,12 C60,6 120,18 200,12 C280,6 340,17 440,12 C540,7 600,18 700,12 C760,7 790,15 800,12"
              stroke="var(--gray-light)"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M80,12 C160,8 240,16 380,12 C520,8 600,15 720,12"
              stroke="var(--gray)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.08"
            />
            <circle cx="180" cy="10" r="1.5" fill="var(--gray-light)" opacity="0.3" />
            <circle cx="480" cy="14" r="1" fill="var(--gray-light)" opacity="0.25" />
            <circle cx="620" cy="9" r="1.2" fill="var(--gray-light)" opacity="0.2" />
          </svg>
          <span className="ink-divider-char font-cjk text-lg text-gray-light" lang="zh">
            {char}
          </span>
        </div>
      </div>
    </div>
  );
}
