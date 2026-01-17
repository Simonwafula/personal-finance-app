export default function Logo({
  width = 40,
  height = 40,
  title = "Sonko",
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
      {/* Background */}
      <rect x="0" y="0" width="160" height="160" rx="32" fill="var(--logo-bg, #1a2942)" />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="barGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="var(--logo-grad-1, #c8e854)" />
          <stop offset="25%" stopColor="var(--logo-grad-2, #64d87d)" />
          <stop offset="50%" stopColor="var(--logo-grad-3, #3dc9b0)" />
          <stop offset="75%" stopColor="var(--logo-grad-4, #2db4d8)" />
          <stop offset="100%" stopColor="var(--logo-grad-5, #3d9ae8)" />
        </linearGradient>
        <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--logo-grad-2, #64d87d)" />
          <stop offset="50%" stopColor="var(--logo-grad-4, #2db4d8)" />
          <stop offset="100%" stopColor="var(--logo-grad-5, #3d9ae8)" />
        </linearGradient>
      </defs>

      {/* Growth bars (styled like stacked blocks) */}
      <g>
        {/* Bar 1 - shortest */}
        <rect x="20" y="95" width="20" height="25" rx="3" fill="url(#barGrad)" opacity="0.9" />
        <path d="M 25 102 L 35 102 M 25 107 L 35 107 M 25 112 L 35 112" stroke="var(--logo-bg, #1a2942)" strokeWidth="1.5" opacity="0.3" />

        {/* Bar 2 */}
        <rect x="45" y="75" width="22" height="45" rx="3" fill="url(#barGrad)" opacity="0.95" />
        <path d="M 50 82 L 62 82 M 50 88 L 62 88 M 50 94 L 62 94 M 50 100 L 62 100 M 50 106 L 62 106 M 50 112 L 62 112" stroke="var(--logo-bg, #1a2942)" strokeWidth="1.5" opacity="0.3" />

        {/* Bar 3 */}
        <rect x="72" y="58" width="22" height="62" rx="3" fill="url(#barGrad)" />
        <path d="M 77 65 L 89 65 M 77 72 L 89 72 M 77 79 L 89 79 M 77 86 L 89 86 M 77 93 L 89 93 M 77 100 L 89 100 M 77 107 L 89 107 M 77 114 L 89 114" stroke="var(--logo-bg, #1a2942)" strokeWidth="1.5" opacity="0.3" />

        {/* Bar 4 - tallest */}
        <rect x="99" y="45" width="20" height="75" rx="3" fill="url(#barGrad)" />
        <path d="M 104 52 L 114 52 M 104 59 L 114 59 M 104 66 L 114 66 M 104 73 L 114 73 M 104 80 L 114 80 M 104 87 L 114 87 M 104 94 L 114 94 M 104 101 L 114 101 M 104 108 L 114 108 M 104 115 L 114 115" stroke="var(--logo-bg, #1a2942)" strokeWidth="1.5" opacity="0.3" />
      </g>

      {/* S-curved growth arrow */}
      <g>
        <path
          d="M 25 110 Q 35 95, 50 85 T 80 65 T 115 35"
          stroke="url(#arrowGrad)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Arrow head */}
        <path d="M 115 35 L 108 32 L 112 40 Z" fill="url(#arrowGrad)" />
      </g>

      {/* Highlight glow effect */}
      <circle cx="110" cy="38" r="8" fill="var(--logo-grad-5, #3d9ae8)" opacity="0.3" />
    </svg>
  );
}
