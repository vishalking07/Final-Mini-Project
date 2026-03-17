import { useId } from "react";

interface BITLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  subTextColor?: string;
  className?: string;
}

export function BITLogo({
  size = 44,
  showText = true,
  textColor = "#1F2937",
  subTextColor = "#6B7280",
  className = "",
}: BITLogoProps) {
  const uid = useId().replace(/:/g, "");

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <radialGradient id={`rg-${uid}`} cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#7c6de8" />
            <stop offset="55%" stopColor="#5540DE" />
            <stop offset="100%" stopColor="#2e2378" />
          </radialGradient>
          <linearGradient id={`flame-${uid}`} x1="50" y1="14" x2="50" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FFE580" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`stem-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="50" cy="50" r="49" fill={`url(#rg-${uid})`} />

        {/* Outer decorative ring */}
        <circle cx="50" cy="50" r="45.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />

        {/* Inner ring */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />

        {/* === TORCH === */}
        {/* Outer flame (orange/gold) */}
        <path
          d="M50 14 C47 20 43.5 27 43.5 33.5 C43.5 41 46.5 45.5 50 45.5 C53.5 45.5 56.5 41 56.5 33.5 C56.5 27 53 20 50 14Z"
          fill="rgba(255,180,30,0.92)"
        />
        {/* Middle flame (yellow) */}
        <path
          d="M50 19 C48.2 24 46.5 29 46.5 33.5 C46.5 38.5 48.2 42.5 50 42.5 C51.8 42.5 53.5 38.5 53.5 33.5 C53.5 29 51.8 24 50 19Z"
          fill="rgba(255,230,80,0.95)"
        />
        {/* Inner flame (white) */}
        <path
          d="M50 24 C49.1 27.5 48.5 31 48.5 33.5 C48.5 37 49.1 39.5 50 39.5 C50.9 39.5 51.5 37 51.5 33.5 C51.5 31 50.9 27.5 50 24Z"
          fill="rgba(255,255,255,0.95)"
        />

        {/* Torch stem */}
        <rect x="47" y="45.5" width="6" height="12" rx="1.5" fill="rgba(255,255,255,0.85)" />

        {/* Torch base/handle */}
        <rect x="43.5" y="56" width="13" height="3.5" rx="1.75" fill="rgba(255,255,255,0.75)" />
        <rect x="45" y="58.5" width="10" height="2.5" rx="1.25" fill="rgba(255,255,255,0.6)" />

        {/* Horizontal ornamental line */}
        <line x1="18" y1="65.5" x2="82" y2="65.5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        {/* Decorative dots on line */}
        <circle cx="50" cy="65.5" r="1.5" fill="rgba(255,215,80,0.7)" />
        <circle cx="28" cy="65.5" r="1" fill="rgba(255,255,255,0.4)" />
        <circle cx="72" cy="65.5" r="1" fill="rgba(255,255,255,0.4)" />

        {/* "BIT" main text */}
        <text
          x="50"
          y="77"
          textAnchor="middle"
          fill="white"
          fontSize="16.5"
          fontWeight="bold"
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="4"
        >
          BIT
        </text>

        {/* "SATHY" sub text */}
        <text
          x="50"
          y="85.5"
          textAnchor="middle"
          fill="rgba(255,255,255,0.65)"
          fontSize="6"
          fontFamily="Arial, Helvetica, sans-serif"
          letterSpacing="3.5"
        >
          SATHY
        </text>

        {/* Bottom: Star decorations + year */}
        <text
          x="50"
          y="93.5"
          textAnchor="middle"
          fill="rgba(255,215,80,0.5)"
          fontSize="5"
          fontFamily="Arial, sans-serif"
          letterSpacing="1.5"
        >
          ✦ 2001 ✦
        </text>
      </svg>

      {/* Text beside logo */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontWeight: 800,
              color: textColor,
              fontSize: "14px",
              letterSpacing: "0.03em",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            BIT Sathy
          </span>
          <span
            style={{
              fontWeight: 400,
              color: subTextColor,
              fontSize: "9.5px",
              letterSpacing: "0.04em",
              marginTop: "2px",
            }}
          >
            Orientation Portal
          </span>
        </div>
      )}
    </div>
  );
}
