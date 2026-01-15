export default function Logo({
  width = 40,
  height = 40,
  title = "Utajiri",
  className = "",
}: {
  width?: number;
  height?: number;
  title?: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <rect x="8" y="8" width="144" height="144" rx="32" fill="var(--logo-bg)" />
      <defs>
        <linearGradient id="gradBars" x1="40" y1="120" x2="120" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--logo-grad-start)" />
          <stop offset="1" stopColor="var(--logo-grad-end)" />
        </linearGradient>
      </defs>

      <rect x="44" y="80" width="16" height="36" rx="4" fill="var(--logo-bar-fill)" />
      <rect x="72" y="64" width="16" height="52" rx="4" fill="var(--logo-bar-fill)" />
      <rect x="100" y="48" width="16" height="68" rx="4" fill="var(--logo-bar-fill)" />

      <rect x="44" y="80" width="16" height="36" rx="4" fill="url(#gradBars)" fillOpacity="0.85" />
      <rect x="72" y="64" width="16" height="52" rx="4" fill="url(#gradBars)" fillOpacity="0.9" />
      <rect x="100" y="48" width="16" height="68" rx="4" fill="url(#gradBars)" fillOpacity="0.95" />

      <path
        d="M40 112 L68 86 L88 92 L116 52"
        stroke="var(--logo-trend)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M110 52 L118 46 L118 56"
        fill="none"
        stroke="var(--logo-trend)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line x1="40" y1="120" x2="120" y2="120" stroke="var(--logo-baseline)" strokeWidth={2} />
    </svg>
  );
}
